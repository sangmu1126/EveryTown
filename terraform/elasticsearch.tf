# ===== Service Discovery (Cloud Map) =====
# 백엔드가 "elasticsearch.everytown.local" 주소로 ES를 찾을 수 있도록 설정

resource "aws_service_discovery_private_dns_namespace" "main" {
  name        = "everytown.local"
  description = "Service Discovery namespace for EveryTown"
  vpc         = aws_vpc.main.id
}

resource "aws_service_discovery_service" "elasticsearch" {
  name = "elasticsearch"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }
}

# ===== Elasticsearch ECS Task Definition =====

resource "aws_cloudwatch_log_group" "elasticsearch" {
  name              = "/ecs/${var.project_name}-elasticsearch"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "elasticsearch" {
  family                   = "${var.project_name}-elasticsearch"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "elasticsearch"
      image     = "309866937539.dkr.ecr.ap-northeast-2.amazonaws.com/everytown-elasticsearch:latest"
      essential = true
      portMappings = [
        {
          containerPort = 9200
          hostPort      = 9200
        }
      ]
      environment = [
        { name = "discovery.type", value = "single-node" },
        { name = "ES_JAVA_OPTS", value = "-Xms1g -Xmx1g" },
        { name = "xpack.security.enabled", value = "false" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.elasticsearch.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ===== Elasticsearch ECS Service =====

resource "aws_ecs_service" "elasticsearch" {
  name            = "${var.project_name}-elasticsearch-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.elasticsearch.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.os_sg.id]
    assign_public_ip = false
  }

  # Service Discovery 등록 - 백엔드가 elasticsearch.everytown.local 로 접근 가능
  service_registries {
    registry_arn = aws_service_discovery_service.elasticsearch.arn
  }
}
