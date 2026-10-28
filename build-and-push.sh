#!/usr/bin/env bash
set -euo pipefail

IMAGE="cappelnord/codeklavier-ar-master"
TAG="${1:-latest}"

echo "Building ${IMAGE}:${TAG} for linux/amd64..."

docker buildx build \
  --platform linux/amd64 \
  -t "${IMAGE}:${TAG}" \
  --push \
  .

echo "Successfully pushed ${IMAGE}:${TAG} to Docker Hub."