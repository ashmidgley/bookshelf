variable "aws_region" {
  description = "AWS region for deployment."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project tag/name prefix."
  type        = string
  default     = "bookshelf"
}

variable "environment" {
  description = "Environment label for tagging."
  type        = string
  default     = "prod"
}

variable "instance_type" {
  description = "EC2 instance type for the API + SQL Server host."
  type        = string
  default     = "t3a.small"
}

variable "root_volume_size_gb" {
  description = "Root volume size in GiB."
  type        = number
  default     = 40
}

variable "root_volume_type" {
  description = "EBS root volume type."
  type        = string
  default     = "gp3"
}

variable "enable_ssh" {
  description = "Whether to allow inbound SSH (22). Prefer SSM if possible."
  type        = bool
  default     = false
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed for SSH ingress when enable_ssh is true."
  type        = string
  default     = "0.0.0.0/32"
}

variable "domain_name" {
  description = "Base domain (example.com). Leave blank to use EIP only."
  type        = string
  default     = ""
}

variable "api_subdomain" {
  description = "Subdomain used for the API record."
  type        = string
  default     = "api"
}

variable "create_route53_record" {
  description = "Create Route53 A record for the API endpoint."
  type        = bool
  default     = false
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID when create_route53_record is true."
  type        = string
  default     = ""
}

variable "api_image" {
  description = "Container image for the API service."
  type        = string
  default     = "ghcr.io/example/bookshelf-api:latest"
}

variable "db_sa_password" {
  description = "SQL Server sa password."
  type        = string
  sensitive   = true
}

variable "jwt_key" {
  description = "JWT signing key for the API."
  type        = string
  sensitive   = true
}

variable "jwt_issuer" {
  description = "JWT issuer value for the API."
  type        = string
}

variable "google_books_key" {
  description = "Google Books API key."
  type        = string
  default     = ""
  sensitive   = true
}

variable "sendgrid_api_key" {
  description = "SendGrid API key."
  type        = string
  default     = ""
  sensitive   = true
}

variable "email_sender_name" {
  description = "Sender name for application emails."
  type        = string
  default     = "Bookshelf"
}

variable "email_sender_address" {
  description = "Sender email address for application emails."
  type        = string
  default     = "no-reply@example.com"
}

variable "email_template" {
  description = "Password reset email template."
  type        = string
  default     = "Click here to reset your password: {{resetToken}}"
}

variable "email_site_url" {
  description = "Base site URL used in email content."
  type        = string
  default     = "https://bookshelf.example.com"
}

variable "create_ssm_parameters" {
  description = "Whether to store app secrets in SSM Parameter Store."
  type        = bool
  default     = false
}

variable "ssm_parameter_prefix" {
  description = "Prefix for SSM parameter names."
  type        = string
  default     = "/bookshelf/prod"
}

variable "tags" {
  description = "Extra tags applied to AWS resources."
  type        = map(string)
  default     = {}
}
