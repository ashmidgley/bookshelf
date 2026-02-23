#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Build and push the Bookshelf API image to Amazon ECR using a version tag.

Usage:
  scripts/push_api_image_ecr.sh [options]

Options:
  -v, --version <tag>         Image tag (default: v0.0.1, must be versioned; "latest" is rejected)
  -r, --region <region>       AWS region (default: AWS region from CLI config)
  -a, --account-id <id>       AWS account ID (default: from sts get-caller-identity)
  -n, --repository <name>     ECR repository name (default: bookshelf-api)
  -c, --context <path>        Docker build context (default: ./api)
  -f, --dockerfile <path>     Dockerfile path (default: ./api/Dockerfile)
      --no-create-repo        Fail if the ECR repo does not exist
  -h, --help                  Show this help

Examples:
  scripts/push_api_image_ecr.sh
  scripts/push_api_image_ecr.sh --version v0.0.2
  scripts/push_api_image_ecr.sh --version v0.1.0 --repository bookshelf-api
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
BUILD_CONTEXT="${REPO_ROOT}/api"
DOCKERFILE_PATH="${REPO_ROOT}/api/Dockerfile"
CREATE_REPO="true"

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
    -c|--context)
      BUILD_CONTEXT="${2:-}"
      shift 2
      ;;
    -f|--dockerfile)
      DOCKERFILE_PATH="${2:-}"
      shift 2
      ;;
    --no-create-repo)
      CREATE_REPO="false"
      shift
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
require_cmd docker

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

if [[ ! -f "${DOCKERFILE_PATH}" ]]; then
  echo "Error: Dockerfile not found at ${DOCKERFILE_PATH}" >&2
  exit 1
fi

if [[ ! -d "${BUILD_CONTEXT}" ]]; then
  echo "Error: Build context directory not found: ${BUILD_CONTEXT}" >&2
  exit 1
fi

if [[ "${VERSION}" == "latest" ]]; then
  echo "Error: refusing to push mutable 'latest' tag. Use a versioned tag (example: v0.0.1)." >&2
  exit 1
fi

if [[ ! "${VERSION}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
  echo "Error: version must look like v0.0.1 (or v0.0.1-rc1)." >&2
  exit 1
fi

ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${REPOSITORY}:${VERSION}"

echo "Target image: ${IMAGE_URI}"
echo "Build context: ${BUILD_CONTEXT}"
echo "Dockerfile: ${DOCKERFILE_PATH}"

if aws ecr describe-repositories --region "${REGION}" --repository-names "${REPOSITORY}" >/dev/null 2>&1; then
  echo "ECR repository exists: ${REPOSITORY}"
else
  if [[ "${CREATE_REPO}" != "true" ]]; then
    echo "Error: ECR repository does not exist: ${REPOSITORY}" >&2
    exit 1
  fi

  echo "Creating ECR repository: ${REPOSITORY}"
  aws ecr create-repository \
    --region "${REGION}" \
    --repository-name "${REPOSITORY}" \
    --image-tag-mutability IMMUTABLE \
    --image-scanning-configuration scanOnPush=true \
    >/dev/null
fi

echo "Logging into ECR registry: ${ECR_REGISTRY}"
aws ecr get-login-password --region "${REGION}" \
  | docker login --username AWS --password-stdin "${ECR_REGISTRY}" >/dev/null

echo "Building Docker image..."
docker build \
  --file "${DOCKERFILE_PATH}" \
  --tag "${IMAGE_URI}" \
  "${BUILD_CONTEXT}"

echo "Pushing image..."
docker push "${IMAGE_URI}"

echo "Done."
echo "Image pushed: ${IMAGE_URI}"
