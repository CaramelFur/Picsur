#!/bin/bash

# Go to this script
cd "$( dirname "${BASH_SOURCE[0]}" )"

# Read current version from ../package.json
VERSION=$(cat ../package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "Building version $VERSION"

docker build -t "ghcr.io/rubikscraft/imagur:$VERSION" -t "ghcr.io/rubikscraft/imagur:latest" -f ./imagur.Dockerfile ..

echo "Done"

echo "Pushing to ghcr.io"

docker push "ghcr.io/rubikscraft/imagur:$VERSION"
docker push "ghcr.io/rubikscraft/imagur:latest"

echo "Done"
