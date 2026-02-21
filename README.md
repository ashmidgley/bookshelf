# Bookshelf: UI/API Scan and Dockerization Plan

## Scan Summary

### UI (`/Users/stu/dev/bookshelf/ui`)
- Stack: Create React App (`react-scripts` `3.4.4`) with React `16.13.1`.
- Runtime config is env-driven in client code:
  - `REACT_APP_API_URL`
  - `REACT_APP_TEMP_IMAGE`
  - `REACT_APP_TRACKING_ID`
  - `REACT_APP_ERROR`
- API calls are built from `REACT_APP_API_URL + "/<resource>"` in `src/shared/*service.js`.
- Current committed `ui/.env` has blank values, so container runtime/build must supply these.
- No Docker assets currently exist (`Dockerfile`, `docker-compose.yml`, nginx config).

### API (`/Users/stu/dev/bookshelf/api`)
- Stack: ASP.NET Core `3.1` (`netcoreapp3.1`) with Entity Framework Core SQL Server provider.
- API routes are prefixed with `/api/...` across controllers.
- Database migrations run automatically on startup (`context.Database.Migrate()`).
- Required config comes from `appsettings`/environment variables:
  - `ConnectionStrings:DefaultConnection`
  - `Jwt:Key`, `Jwt:Issuer`
  - `GoogleBooks:*`
  - `Email:*`
- Includes `UseHttpsRedirection()` and CORS setup.
- No Docker assets currently exist.

### Integration Findings
- UI and API are cleanly separable services, but UI must be given an API base URL that includes `/api` (for example: `http://localhost:8080/api` or `/api` behind a reverse proxy).
- API startup depends on SQL Server availability because migrations run at boot.
- API is pinned to .NET Core 3.1 (end-of-life), which is a medium-term upgrade risk for local tooling and base image availability.
- CORS middleware is currently placed after endpoint mapping; for cross-origin browser calls, this should be moved between `UseRouting()` and `UseAuthentication()`/`UseAuthorization()` during Docker implementation.

## Dockerization Plan (Local)

### Goal
Run `ui`, `api`, and `db` locally with one command and predictable config.

### Phase 1: Define Container Contract
1. Standardize local ports:
   - `ui`: `3000`
   - `api`: `8080`
   - `sqlserver`: `1433`
2. Standardize env files:
   - Root `.env.docker` (actual local values, gitignored)
   - Root `.env.docker.example` (template)

### Phase 2: Containerize API
1. Add `/Users/stu/dev/bookshelf/api/Dockerfile` (multi-stage):
   - Build stage: `mcr.microsoft.com/dotnet/sdk:3.1`
   - Runtime stage: `mcr.microsoft.com/dotnet/aspnet:3.1`
2. Set `ASPNETCORE_URLS=http://+:8080` and expose `8080`.
3. Provide config via environment variables in compose:
   - `ConnectionStrings__DefaultConnection=Server=db,1433;Database=bookshelf;User Id=sa;Password=...;TrustServerCertificate=True`
   - `Jwt__Key`, `Jwt__Issuer`, `GoogleBooks__*`, `Email__*`
4. Keep migration-on-startup behavior, but rely on DB healthcheck + restart policy to avoid boot race failures.

### Phase 3: Containerize UI
1. Add `/Users/stu/dev/bookshelf/ui/Dockerfile` (multi-stage):
   - Build stage: `node:14` (safer with CRA 3.x)
   - Runtime stage: `nginx:alpine`
2. Build with `REACT_APP_API_URL=/api` and configure nginx reverse proxy `/api -> api:8080`.
3. Expose container port `80`, map host `3000:80`.

### Phase 4: Compose Orchestration
1. Add `/Users/stu/dev/bookshelf/docker-compose.yml` with services:
   - `db` (SQL Server)
   - `api` (depends on healthy `db`)
   - `ui` (depends on `api`)
2. Add SQL healthcheck on `db`.
3. Use named volume for SQL persistence.
4. Add network-scoped service names (`db`, `api`, `ui`) for internal resolution.

### Phase 5: Hardening and Dev Ergonomics
1. Move CORS middleware to recommended position in API pipeline.
2. Make `UseHttpsRedirection()` conditional for local container mode (or configure proper HTTPS port mapping).
3. Add `.dockerignore` files for both services.
4. Document local run/stop/reset commands in this README once Docker files are added.

## Proposed Files To Add
- `/Users/stu/dev/bookshelf/docker-compose.yml`
- `/Users/stu/dev/bookshelf/.env.docker.example`
- `/Users/stu/dev/bookshelf/api/Dockerfile`
- `/Users/stu/dev/bookshelf/api/.dockerignore`
- `/Users/stu/dev/bookshelf/ui/Dockerfile`
- `/Users/stu/dev/bookshelf/ui/.dockerignore`
- `/Users/stu/dev/bookshelf/ui/nginx.conf`

## Verification Checklist (After Implementation)
1. `docker compose up --build` starts all three services.
2. `http://localhost:3000` loads UI.
3. UI authentication and CRUD flows can reach API through `/api`.
4. API logs show successful DB migration on boot.
5. Restarting stack preserves DB data via named volume.
