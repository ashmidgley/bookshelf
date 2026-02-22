data "aws_ami" "al2023_x86_64" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default_vpc" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  api_domain  = trimspace(var.domain_name) != "" ? "${var.api_subdomain}.${trimspace(var.domain_name)}" : ""

  common_tags = merge(var.tags, {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  })

  ssm_secure_values = {
    db_sa_password   = var.db_sa_password
    jwt_key          = var.jwt_key
    jwt_issuer       = var.jwt_issuer
    google_books_key = var.google_books_key
    sendgrid_api_key = var.sendgrid_api_key
  }

  ssm_parameter_keys = toset(compact([
    "db_sa_password",
    "jwt_key",
    "jwt_issuer",
    nonsensitive(var.google_books_key) != "" ? "google_books_key" : "",
    nonsensitive(var.sendgrid_api_key) != "" ? "sendgrid_api_key" : "",
  ]))
}

resource "aws_security_group" "bookshelf" {
  name        = "${local.name_prefix}-sg"
  description = "Bookshelf API ingress controls"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = var.enable_ssh ? [1] : []
    content {
      description = "SSH"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [var.allowed_ssh_cidr]
    }
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-sg"
  })
}

resource "aws_iam_role" "ec2" {
  name = "${local.name_prefix}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${local.name_prefix}-instance-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_instance" "bookshelf" {
  ami                         = data.aws_ami.al2023_x86_64.id
  instance_type               = var.instance_type
  subnet_id                   = data.aws_subnets.default_vpc.ids[0]
  vpc_security_group_ids      = [aws_security_group.bookshelf.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  associate_public_ip_address = true
  user_data = templatefile("${path.module}/user_data.sh.tmpl", {
    project_name         = var.project_name
    api_domain           = local.api_domain
    api_image            = var.api_image
    db_sa_password       = var.db_sa_password
    jwt_key              = var.jwt_key
    jwt_issuer           = var.jwt_issuer
    google_books_key     = var.google_books_key
    sendgrid_api_key     = var.sendgrid_api_key
    email_sender_name    = var.email_sender_name
    email_sender_address = var.email_sender_address
    email_template       = var.email_template
    email_site_url       = var.email_site_url
  })

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    volume_size = var.root_volume_size_gb
    volume_type = var.root_volume_type
    encrypted   = true
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-ec2"
  })

  depends_on = [aws_iam_role_policy_attachment.ssm_core]
}

resource "aws_eip" "bookshelf" {
  domain = "vpc"
  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-eip"
  })
}

resource "aws_eip_association" "bookshelf" {
  instance_id   = aws_instance.bookshelf.id
  allocation_id = aws_eip.bookshelf.id
}

resource "aws_route53_record" "api" {
  count   = var.create_route53_record ? 1 : 0
  zone_id = var.route53_zone_id
  name    = local.api_domain
  type    = "A"
  ttl     = 300
  records = [aws_eip.bookshelf.public_ip]

  lifecycle {
    precondition {
      condition     = local.api_domain != "" && var.route53_zone_id != ""
      error_message = "Set domain_name and route53_zone_id when create_route53_record is true."
    }
  }
}

resource "aws_ssm_parameter" "app_secrets" {
  for_each = var.create_ssm_parameters ? { for key in local.ssm_parameter_keys : key => key } : {}

  name  = "${trimsuffix(var.ssm_parameter_prefix, "/")}/${each.key}"
  type  = "SecureString"
  value = local.ssm_secure_values[each.key]

  tags = local.common_tags
}
