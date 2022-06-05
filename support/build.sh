#!/bin/bash

# Go to this script
cd "$(dirname "${BASH_SOURCE[0]}")"

# Read current version from ../package.json
VERSION=$(cat ../package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "Building version $VERSION"

docker build -t "ghcr.io/rubikscraft/picsur:$VERSION" -t "ghcr.io/rubikscraft/picsur:latest" -f ./picsur.Dockerfile ..

echo "Done"

echo "Pushing to ghcr.io"

docker push "ghcr.io/rubikscraft/picsur:$VERSION"
docker push "ghcr.io/rubikscraft/picsur:latest"

echo "Done"
