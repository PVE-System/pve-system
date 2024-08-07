variable "aws_profile" {
  description = "The AWS CLI profile to use"
  type        = string
  default     = "default"
}

variable "db_username" {
  description = "The username for the RDS instance"
  type        = string
}

variable "db_password" {
  description = "The password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "s3_state_bucket_name" {
  description = "The name of the S3 bucket to store Terraform state"
  type        = string
  default     = "pve-terraform-state-bucket"
}
