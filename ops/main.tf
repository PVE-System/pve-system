provider "aws" {
  profile = var.aws_profile
  region  = "sa-east-1"
}

terraform {
  backend "s3" {
    profile        = var.aws_profile
    bucket         = var.s3_state_bucket_name
    key            = "./terraform.tfstate"
    region         = "sa-east-1"
  }
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = var.s3_state_bucket_name

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

data "aws_availability_zones" "available" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.9.0"

  name                 = "pve-vpc"
  cidr                 = "10.0.0.0/16"
  azs                  = data.aws_availability_zones.available.names
  public_subnets       = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_db_subnet_group" "pve" {
  name       = "pve"
  subnet_ids = module.vpc.public_subnets

  tags = {
    Name = "pve"
  }
}

resource "aws_security_group" "rds" {
  name   = "pve_rds"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "pve_rds"
  }
}

resource "aws_db_parameter_group" "pve" {
  name   = "pve"
  family = "postgres14"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "pve" {
  identifier             = "pve"
  instance_class         = "db.t3.micro"
  allocated_storage      = 5
  engine                 = "postgres"
  engine_version         = "14.11"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.pve.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.pve.name
  publicly_accessible    = true
  skip_final_snapshot    = true
}
