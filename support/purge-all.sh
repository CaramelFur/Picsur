#!/bin/bash

yarn purge

(
  cd shared
  yarn purge
)

(
  cd backend
  yarn purge
)

(
  cd frontend
  yarn purge
)

(
  cd support
  podman-compose -f ./dev.docker-compose.yml down
)
