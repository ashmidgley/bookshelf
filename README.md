# Bookshelf

## Project Structure
```text
bookshelf/
├── apps/
│   ├── api/
│   │   ├── Bookshelf.Core/
│   │   ├── Bookshelf.Tests/
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev
│   └── ui/
│       ├── src/
│       ├── public/
│       ├── Dockerfile
│       ├── Dockerfile.dev
│       └── nginx.conf
├── infra/
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       ├── user_data.sh.tmpl
│       └── terraform.tfvars.example
├── scripts/
│   ├── push_api_image_ecr.sh
│   └── push_api_image_codebuild.sh
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.docker.example
```

## Project Summary
- Monorepo layout uses `apps/`:
  - UI: React (CRA) in `apps/ui`
  - API: ASP.NET Core 3.1 + EF Core in `apps/api`
- Local stack runs with Docker Compose:
  - UI at `http://localhost:3000`
  - API at `http://localhost:8080`
  - SQL Server at `localhost:1433`
- API includes health endpoints that return `pong`:
  - `GET /`
  - `GET /health`
- AWS deploy is managed from `infra/terraform` (EC2 + Docker Compose + Caddy reverse proxy).
- API images are pushed to ECR with versioned tags (no `latest`) via scripts in `scripts/`.

## Local Run
1. Create env file:
```bash
cp .env.docker.example .env.docker
```

2. Start full stack:
```bash
docker compose --env-file .env.docker up --build
```

3. Stop stack:
```bash
docker compose --env-file .env.docker down
```

4. Stop and remove DB volume:
```bash
docker compose --env-file .env.docker down -v
```

## Dev Mode (Hot Reload)
```bash
docker compose \
  --env-file .env.docker \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up --build
```

- UI hot reload: `http://localhost:3000`
- API with `dotnet watch`: `http://localhost:8080`
