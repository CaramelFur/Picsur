#!/bin/bash

PACKAGE_URL="ghcr.io/rubikscraft/picsur"

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

docker buildx create --append --use --name picsur

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --push \
  -t "$PACKAGE_URL:$VERSION" \
  -t "$PACKAGE_URL:latest" \
  -f ./picsur.Dockerfile ..

echo "Done pushing $PACKAGE_URL:$VERSION"
