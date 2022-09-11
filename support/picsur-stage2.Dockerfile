# This dockerfile than builds the production dependencies and the final image

# Always fetch amd64 image
FROM ghcr.io/rubikscraft/picsur-alpha-stage1:latest AS BUILDER_STAGE1

FROM node:18.8-alpine AS BUILDER_STAGE2

RUN apk add python3 build-base

WORKDIR /picsur
COPY --from=BUILDER_STAGE1 /picsur ./

RUN yarn workspaces focus -A --production

FROM node:18.8-alpine

ENV PICSUR_PRODUCTION=true

WORKDIR /picsur
COPY --from=BUILDER_STAGE2 /picsur ./

CMD yarn workspace picsur-backend start:prod
