# This dockerfile only builds the javascript part of the project, so tsc and angular compilation

FROM node:18 AS BUILDER_STAGE1

SHELL ["/bin/bash", "-c"]

ADD . /picsur
WORKDIR /picsur

RUN yarn workspaces focus -A

RUN yarn workspace picsur-shared build
RUN yarn workspace picsur-frontend build
RUN yarn workspace picsur-backend build

RUN mkdir -p /trimmed

RUN cp -r --parents ./{package.json,yarn.lock,.yarnrc.yml,branding} /trimmed
RUN cp -r --parents ./{frontend,backend,shared}/{dist,package.json} /trimmed

FROM scratch

WORKDIR /picsur
ADD .yarn .yarn
COPY --from=BUILDER_STAGE1 /trimmed ./
