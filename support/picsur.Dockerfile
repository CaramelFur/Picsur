FROM ghcr.io/rubikscraft/node-docker:1.0.0

# Sorry for the humongous docker container this generates
# Maybe I'll trim it down some day

ENV PICSUR_PRODUCTION=true

ADD . /picsur
WORKDIR /picsur

RUN yarn install --frozen-lockfile

WORKDIR /picsur/shared
RUN yarn build

WORKDIR /picsur/frontend
RUN yarn build

WORKDIR /picsur/backend
RUN yarn build

CMD ["yarn", "start:prod"]

