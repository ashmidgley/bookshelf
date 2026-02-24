#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Build and push the Bookshelf API image to ECR using AWS CodeBuild.
This avoids local Docker->ECR network issues by running the push inside AWS.

Usage:
  scripts/push_api_image_codebuild.sh [options]

Options:
  -v, --version <tag>         Image tag (default: v0.0.1, must be versioned)
  -r, --region <region>       AWS region (default: AWS CLI configured region)
  -a, --account-id <id>       AWS account ID (default: from sts get-caller-identity)
  -n, --repository <name>     ECR repository name (default: bookshelf-api)
  -p, --project-name <name>   CodeBuild project name (default: bookshelf-api-image-build)
  -s, --source-dir <path>     Source directory to package (default: ./api)
  -h, --help                  Show this help

Example:
  scripts/push_api_image_codebuild.sh --version v0.0.1
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

VERSION="v0.0.1"
REGION="${AWS_REGION:-}"
ACCOUNT_ID=""
REPOSITORY="bookshelf-api"
PROJECT_NAME="bookshelf-api-image-build"
SOURCE_DIR="${REPO_ROOT}/api"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--version)
      VERSION="${2:-}"
      shift 2
      ;;
    -r|--region)
      REGION="${2:-}"
      shift 2
      ;;
    -a|--account-id)
      ACCOUNT_ID="${2:-}"
      shift 2
      ;;
    -n|--repository)
      REPOSITORY="${2:-}"
      shift 2
      ;;
    -p|--project-name)
      PROJECT_NAME="${2:-}"
      shift 2
      ;;
    -s|--source-dir)
      SOURCE_DIR="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

require_cmd aws
require_cmd zip

if [[ "${VERSION}" == "latest" ]]; then
  echo "Error: refusing mutable 'latest' tag. Use a versioned tag (example: v0.0.1)." >&2
  exit 1
fi

if [[ ! "${VERSION}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
  echo "Error: version must look like v0.0.1 (or v0.0.1-rc1)." >&2
  exit 1
fi

if [[ -z "${REGION}" ]]; then
  REGION="$(aws configure get region || true)"
fi

if [[ -z "${REGION}" ]]; then
  echo "Error: AWS region is not set. Use --region or configure AWS CLI." >&2
  exit 1
fi

if [[ -z "${ACCOUNT_ID}" ]]; then
  ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
fi

if [[ ! -d "${SOURCE_DIR}" ]]; then
  echo "Error: source directory not found: ${SOURCE_DIR}" >&2
  exit 1
fi

ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${REPOSITORY}:${VERSION}"
ROLE_NAME="bookshelf-codebuild-ecr-role"
ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
S3_BUCKET="bookshelf-codebuild-src-${ACCOUNT_ID}-${REGION}"
S3_KEY="bookshelf-api/${VERSION}/source.zip"
S3_LOCATION="${S3_BUCKET}/${S3_KEY}"

echo "Target image: ${IMAGE_URI}"
echo "CodeBuild project: ${PROJECT_NAME}"
echo "Source dir: ${SOURCE_DIR}"

if ! aws ecr describe-repositories --region "${REGION}" --repository-names "${REPOSITORY}" >/dev/null 2>&1; then
  echo "Creating ECR repository: ${REPOSITORY}"
  aws ecr create-repository \
    --region "${REGION}" \
    --repository-name "${REPOSITORY}" \
    --image-tag-mutability IMMUTABLE \
    --image-scanning-configuration scanOnPush=true \
    >/dev/null
fi

if ! aws iam get-role --role-name "${ROLE_NAME}" >/dev/null 2>&1; then
  echo "Creating IAM role: ${ROLE_NAME}"
  TRUST_DOC="$(mktemp)"
  cat > "${TRUST_DOC}" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  aws iam create-role \
    --role-name "${ROLE_NAME}" \
    --assume-role-policy-document "file://${TRUST_DOC}" \
    >/dev/null

  rm -f "${TRUST_DOC}"

  aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

  aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

  aws iam attach-role-policy \
    --role-name "${ROLE_NAME}" \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

  # Allow IAM propagation.
  sleep 15
fi

if ! aws s3api head-bucket --bucket "${S3_BUCKET}" >/dev/null 2>&1; then
  echo "Creating S3 bucket: ${S3_BUCKET}"
  if [[ "${REGION}" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "${S3_BUCKET}" >/dev/null
  else
    aws s3api create-bucket \
      --bucket "${S3_BUCKET}" \
      --create-bucket-configuration "LocationConstraint=${REGION}" \
      >/dev/null
  fi
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT
PACKAGE_DIR="${TMP_DIR}/source"
ZIP_PATH="${TMP_DIR}/source.zip"

mkdir -p "${PACKAGE_DIR}"
cp -R "${SOURCE_DIR}/." "${PACKAGE_DIR}/"

cat > "${PACKAGE_DIR}/buildspec.yml" <<EOF
version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region \$AWS_REGION | docker login --username AWS --password-stdin ${ECR_REGISTRY}
  build:
    commands:
      - docker build -f Dockerfile -t ${IMAGE_URI} .
      - docker push ${IMAGE_URI}
EOF

(cd "${PACKAGE_DIR}" && zip -qr "${ZIP_PATH}" .)

aws s3 cp "${ZIP_PATH}" "s3://${S3_BUCKET}/${S3_KEY}" >/dev/null

if aws codebuild batch-get-projects --names "${PROJECT_NAME}" --query 'projects[0].name' --output text 2>/dev/null | grep -q "${PROJECT_NAME}"; then
  echo "Updating CodeBuild project: ${PROJECT_NAME}"
  aws codebuild update-project \
    --name "${PROJECT_NAME}" \
    --service-role "${ROLE_ARN}" \
    --source "type=S3,location=${S3_LOCATION},buildspec=buildspec.yml" \
    --artifacts "type=NO_ARTIFACTS" \
    --environment "type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL,privilegedMode=true" \
    --timeout-in-minutes 60 \
    >/dev/null
else
  echo "Creating CodeBuild project: ${PROJECT_NAME}"
  aws codebuild create-project \
    --name "${PROJECT_NAME}" \
    --service-role "${ROLE_ARN}" \
    --source "type=S3,location=${S3_LOCATION},buildspec=buildspec.yml" \
    --artifacts "type=NO_ARTIFACTS" \
    --environment "type=LINUX_CONTAINER,image=aws/codebuild/standard:7.0,computeType=BUILD_GENERAL1_SMALL,privilegedMode=true" \
    --timeout-in-minutes 60 \
    >/dev/null
fi

BUILD_ID="$(aws codebuild start-build --project-name "${PROJECT_NAME}" --query 'build.id' --output text)"
echo "Started build: ${BUILD_ID}"

while true; do
  BUILD_STATUS="$(aws codebuild batch-get-builds --ids "${BUILD_ID}" --query 'builds[0].buildStatus' --output text)"
  echo "Build status: ${BUILD_STATUS}"

  case "${BUILD_STATUS}" in
    SUCCEEDED)
      break
      ;;
    FAILED|FAULT|TIMED_OUT|STOPPED)
      LOG_GROUP="$(aws codebuild batch-get-builds --ids "${BUILD_ID}" --query 'builds[0].logs.groupName' --output text)"
      LOG_STREAM="$(aws codebuild batch-get-builds --ids "${BUILD_ID}" --query 'builds[0].logs.streamName' --output text)"
      echo "Build failed. Logs: ${LOG_GROUP} / ${LOG_STREAM}" >&2
      exit 1
      ;;
  esac

  sleep 10
done

echo "Build succeeded."
echo "Image pushed: ${IMAGE_URI}"
aws ecr describe-images \
  --region "${REGION}" \
  --repository-name "${REPOSITORY}" \
  --image-ids "imageTag=${VERSION}" \
  --query 'imageDetails[0].{tags:imageTags,digest:imageDigest,pushed:imagePushedAt}' \
  --output table
