# Copilot Instructions

## Architecture Overview

This is a minimal full-stack "dummy" app used for diagnostics and experimentation:

- **`dummy-api/`** — ASP.NET Core 10 minimal API backend
- **`dummy-frontend/`** — React 19 + TypeScript + Vite frontend, served by Caddy

In production (Docker), Caddy serves the frontend static files and reverse-proxies `/api/*` requests to the backend via the `API_URL` environment variable. Locally, the frontend dev server proxies should be configured similarly.

## Backend (`dummy-api/`)

- **Stack**: .NET 10, C# minimal APIs, `net10.0` target
- **Solution file**: `DummyApi.slnx` (new `.slnx` format)
- **Project**: `src/DummyApi/DummyApi.csproj`
- `Nullable` and `ImplicitUsings` are enabled

**Run locally:**
```bash
cd dummy-api
dotnet run --project src/DummyApi
```

**Build:**
```bash
cd dummy-api
dotnet build
```

**Endpoints:**
- `GET /api/healthz` — ASP.NET health check
- `GET /api/inspect` — returns all incoming request headers as JSON

## Frontend (`dummy-frontend/`)

- **Stack**: React 19, TypeScript 5.8, Vite 6
- No router or state management library

**Run locally:**
```bash
cd dummy-frontend
npm install
npm run dev
```

**Build:**
```bash
cd dummy-frontend
npm run build   # runs tsc -b then vite build
```

## Docker

Run the full stack:
```bash
docker compose up --build
```

Build and push images to Docker Hub:
```bash
export DOCKER_USERNAME=myuser
# Optional: export TAG=v1.0.0  (defaults to "latest")
./build-and-push.sh
```

Images are built for `linux/amd64` via `docker buildx`.

## Key Conventions

- API routes are all prefixed with `/api/`
- The frontend never calls the backend directly by hostname — all API calls are relative paths (`/api/...`), relying on Caddy (in Docker) or a dev proxy to forward them
- Inline CSS styles (via `React.CSSProperties`) are used in the frontend rather than CSS files or CSS modules
