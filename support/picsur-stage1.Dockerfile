# This dockerfile only builds the javascript part of the project, so tsc and angular compilation

FROM node:20 AS builder_stage1

RUN npm install -g pnpm

SHELL ["/bin/bash", "-c"]

ADD . /picsur
WORKDIR /picsur

RUN pnpm install --frozen-lockfile

RUN pnpm --filter picsur-shared build
RUN pnpm --filter picsur-frontend build
RUN pnpm --filter picsur-backend build

RUN mkdir -p /trimmed

RUN cp -r --parents ./{package.json,pnpm-lock.yaml,pnpm-workspace.yaml,branding} /trimmed
RUN cp -r --parents ./{frontend,backend,shared}/{dist,package.json} /trimmed

FROM scratch

WORKDIR /picsur

COPY --from=builder_stage1 /trimmed ./
