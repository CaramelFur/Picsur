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
