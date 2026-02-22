output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.bookshelf.id
}

output "instance_public_ip" {
  description = "Stable public IP from the Elastic IP."
  value       = aws_eip.bookshelf.public_ip
}

output "api_domain" {
  description = "Configured API domain, if Route53/domain settings are used."
  value       = local.api_domain != "" ? local.api_domain : null
}

output "api_base_url" {
  description = "API base URL (domain if configured, otherwise EIP)."
  value       = local.api_domain != "" ? "https://${local.api_domain}" : "http://${aws_eip.bookshelf.public_ip}"
}

output "ssm_parameter_names" {
  description = "Names of SSM parameters created by this stack."
  value       = [for p in aws_ssm_parameter.app_secrets : p.name]
}
