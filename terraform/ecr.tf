resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "recommend" {
  name                 = "${var.project_name}-recommend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}
