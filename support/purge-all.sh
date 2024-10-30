#!/bin/bash

pnpm --filter picsur-shared purge
pnpm --filter picsur-frontend purge
pnpm --filter picsur-backend purge

pnpm devdb:remove
pnpm purge

