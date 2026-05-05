terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # backend "s3" {} # 운영 환경에서는 S3 백엔드 설정을 권장합니다.
}

provider "aws" {
  region = var.aws_region
}
