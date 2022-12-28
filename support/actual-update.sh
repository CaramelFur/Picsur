#!/bin/bash

# Really yarn, why the hell am I supposed to do this?
# If I tell you to upgrade, upgrade everything

# Go to this script parent
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Print a list of all packages
# Get ndjson stream from yarn
# Strip the quotes from the package names
# Strip the version from the package names
# Concat all package names into a single line with spaces
# Run "yarn up -R {all-packages}" to update all packages
yarn info --name-only -R -A --json \
  | jq \
  | sed 's/\"//g' \
  | sed 's/@.*//g' \
  | sort \
  | uniq \
  | xargs yarn up -R
