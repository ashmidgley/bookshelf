# Bookshelf: Local Docker Run Setup

## Layout
- UI: `/Users/stu/dev/bookshelf/apps/ui`
- API: `/Users/stu/dev/bookshelf/apps/api`
- Compose: `/Users/stu/dev/bookshelf/docker-compose.yml`

## Service Summary
- UI is a CRA app (React 16) built into nginx and served on `http://localhost:3000`.
- API is ASP.NET Core 3.1 + EF Core SQL Server, exposed on `http://localhost:8080`.
- Database is SQL Server 2019, exposed on `localhost:1433`.
- UI calls API through nginx reverse proxy path `/api`.

## Docker Files Added
- `/Users/stu/dev/bookshelf/docker-compose.yml`
- `/Users/stu/dev/bookshelf/docker-compose.dev.yml`
- `/Users/stu/dev/bookshelf/.env.docker.example`
- `/Users/stu/dev/bookshelf/apps/api/Dockerfile`
- `/Users/stu/dev/bookshelf/apps/api/Dockerfile.dev`
- `/Users/stu/dev/bookshelf/apps/api/.dockerignore`
- `/Users/stu/dev/bookshelf/apps/ui/Dockerfile`
- `/Users/stu/dev/bookshelf/apps/ui/Dockerfile.dev`
- `/Users/stu/dev/bookshelf/apps/ui/.dockerignore`
- `/Users/stu/dev/bookshelf/apps/ui/nginx.conf`

## API Runtime Adjustment
- CORS middleware moved to run after `UseRouting()` and before auth.
- HTTPS redirection now runs only outside Development, so local docker HTTP proxying works cleanly.

## Local Run
1. Create local env file:
   - `cp /Users/stu/dev/bookshelf/.env.docker.example /Users/stu/dev/bookshelf/.env.docker`
2. Start all services:
   - `docker compose --env-file /Users/stu/dev/bookshelf/.env.docker up --build`
3. Open:
   - UI: `http://localhost:3000`
   - API: `http://localhost:8080`
4. Stop:
   - `docker compose --env-file /Users/stu/dev/bookshelf/.env.docker down`
5. Stop and remove DB volume:
   - `docker compose --env-file /Users/stu/dev/bookshelf/.env.docker down -v`

## Dev Hot Reload Run
1. Create local env file (if needed):
   - `cp /Users/stu/dev/bookshelf/.env.docker.example /Users/stu/dev/bookshelf/.env.docker`
2. Start with dev override:
   - `docker compose --env-file /Users/stu/dev/bookshelf/.env.docker -f /Users/stu/dev/bookshelf/docker-compose.yml -f /Users/stu/dev/bookshelf/docker-compose.dev.yml up --build`
3. Open:
   - UI (hot reload): `http://localhost:3000`
   - API (dotnet watch): `http://localhost:8080`
4. Stop:
   - `docker compose --env-file /Users/stu/dev/bookshelf/.env.docker -f /Users/stu/dev/bookshelf/docker-compose.yml -f /Users/stu/dev/bookshelf/docker-compose.dev.yml down`

## Notes
- API runs EF migrations on startup; first boot depends on SQL container readiness.
- .NET Core 3.1 is end-of-life; moving API to a supported runtime should be planned next.
