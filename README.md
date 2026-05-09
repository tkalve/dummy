# dummy

A minimal full-stack app used for diagnostics and experimentation.

| Service  | Image                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API      | [![Docker Hub](https://img.shields.io/docker/v/tkalve/dummy-api?label=dummy-api&logo=docker&logoColor=white)](https://hub.docker.com/repository/docker/tkalve/dummy-api)                |
| Frontend | [![Docker Hub](https://img.shields.io/docker/v/tkalve/dummy-frontend?label=dummy-frontend&logo=docker&logoColor=white)](https://hub.docker.com/repository/docker/tkalve/dummy-frontend) |

## Stack

- **Backend** — ASP.NET Core 10 minimal API (`dummy-api/`)
- **Frontend** — React 19 + TypeScript + Vite, served by Caddy (`dummy-frontend/`)

## Running with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost
- API: http://localhost:8080

## Building & pushing images

```bash
export DOCKER_USERNAME=<your-dockerhub-username>
# Optional: export TAG=v1.0.0  (defaults to "latest")
./build-and-push.sh
```

Images are built for `linux/amd64` via `docker buildx`.

## Running locally

**API:**

```bash
cd dummy-api
dotnet run --project src/DummyApi
```

**Frontend:**

```bash
cd dummy-frontend
npm install
npm run dev
```

## API endpoints

| Method | Path           | Description                                  |
| ------ | -------------- | -------------------------------------------- |
| `GET`  | `/api/healthz` | Health check                                 |
| `GET`  | `/api/inspect` | Returns all incoming request headers as JSON |
