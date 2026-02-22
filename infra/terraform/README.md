# Bookshelf Terraform

Minimal AWS stack for the Bookshelf API + SQL Server runtime:
- One EC2 instance (Amazon Linux 2023, x86_64)
- Security group (80/443 open, optional 22)
- IAM role/profile with SSM access
- Elastic IP
- Optional Route53 `A` record
- Optional SSM parameter storage for secrets

## Files
- `main.tf`: core resources
- `variables.tf`: inputs
- `outputs.tf`: important outputs
- `user_data.sh.tmpl`: bootstrap script for Docker Compose runtime
- `terraform.tfvars.example`: sample variable values

## Usage
```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with real secrets and values.
terraform init
terraform plan
terraform apply
```

## Notes
- This stack assumes a default VPC exists in the target region.
- SQL Server and API run in Docker on the same host for cost control.
- Secrets passed as Terraform variables are stored in Terraform state; use remote encrypted state and restricted access.
