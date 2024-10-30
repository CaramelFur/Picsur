# This dockerfile than builds the production dependencies and the final image

# Always fetch amd64 image
FROM ghcr.io/caramelfur/picsur-alpha-stage1:latest AS builder_stage1

FROM node:20-alpine AS builder_stage2

RUN npm install -g pnpm

RUN apk add python3 build-base

WORKDIR /picsur
COPY --from=builder_stage1 /picsur ./

RUN pnpm install --frozen-lockfile --prod

FROM node:20-alpine

RUN npm install -g pnpm

ENV PICSUR_PRODUCTION=true

WORKDIR /picsur
COPY --from=builder_stage2 /picsur ./

CMD ["pnpm", "--filter", "picsur-backend", "start:prod"]

