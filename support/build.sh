#!/bin/bash

PACKAGE_URL="ghcr.io/rubikscraft/picsur"

# Go to this script
cd "$(dirname "${BASH_SOURCE[0]}")"

# Read current version from ../package.json
VERSION=$(cat ../package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "Building version $VERSION"

docker build -t "$PACKAGE_URL:$VERSION" -t "$PACKAGE_URL:latest" -f ./picsur.Dockerfile ..

echo "Done"

# only push if argument is set to "push"
if [ "$1" == "push" ]; then
  echo "Pushing to registry"

  docker push "$PACKAGE_URL:$VERSION"
  docker push "$PACKAGE_URL:latest"

  echo "Done"
else 
  echo "Not pushing to registry"
fi
