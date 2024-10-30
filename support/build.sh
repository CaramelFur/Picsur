#!/bin/bash

PACKAGE_URL="ghcr.io/caramelfur/picsur"

if [ "$1" == "alpha" ]; then
  PACKAGE_URL="$PACKAGE_URL-alpha"
elif [ "$1" == "stable" ]; then
  true
else
  echo "Usage: $0 [alpha|stable]"
  exit 1
fi

# Go to this script
cd "$(dirname "${BASH_SOURCE[0]}")"

# Install binfmt

docker run --privileged --rm tonistiigi/binfmt --install all

# Read current version from ../package.json
VERSION=$(cat ../package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "Building version $VERSION"

# Allow host networking for buildx
# First check if builder exists
if docker buildx ls | grep -q picsur; then
  docker buildx create --name picsur --append --driver-opt network=host
else
  docker buildx create --name picsur --driver-opt network=host
fi

docker build \
  --push \
  --network host \
  -t "$PACKAGE_URL-stage1:$VERSION" \
  -t "$PACKAGE_URL-stage1:latest" \
  -f ./picsur-stage1.Dockerfile ..

# Exit if stage1 build failed
if [ $? -ne 0 ]; then
  echo "Stage1 build failed"
  exit 1
fi

docker buildx build \
  --builder picsur \
  --platform linux/amd64,linux/arm64 \
  --push \
  --network host \
  -t "$PACKAGE_URL:$VERSION" \
  -t "$PACKAGE_URL:latest" \
  -f ./picsur-stage2.Dockerfile ..

# Exit if stage2 build failed
if [ $? -ne 0 ]; then
  echo "Stage2 build failed"
  exit 1
fi

echo "Done pushing $PACKAGE_URL:$VERSION"
