#!/bin/bash

# First param
VERSION=$1

# Check not null
if [ -z "$VERSION" ]; then
  echo "Please specify a version"
  exit 1
fi

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

UPDATE_VERSION="pnpm version --f"

cd $SCRIPT_PATH/..
$UPDATE_VERSION $VERSION

(
  cd backend
  $UPDATE_VERSION $VERSION
)

(
  cd frontend
  $UPDATE_VERSION $VERSION
)

(
  cd shared
  $UPDATE_VERSION $VERSION
)
