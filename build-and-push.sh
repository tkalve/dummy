#!/usr/bin/env bash
set -euo pipefail

USERNAME="${DOCKER_USERNAME:?DOCKER_USERNAME environment variable is required (e.g. export DOCKER_USERNAME=myuser)}"
TAG="${TAG:-latest}"

echo "==> Building and pushing dummy-api ($USERNAME/dummy-api:$TAG)..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  -t "$USERNAME/dummy-api:$TAG" \
  ./dummy-api

echo "==> Building and pushing dummy-frontend ($USERNAME/dummy-frontend:$TAG)..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  -t "$USERNAME/dummy-frontend:$TAG" \
  ./dummy-frontend

echo "==> Done."
