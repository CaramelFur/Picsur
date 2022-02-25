FROM node:16-alpine

# Sorry for the humongous docker container this generates
# Maybe I'll trim it down some day

ADD . /imagur
WORKDIR /imagur

RUN yarn install --frozen-lockfile

WORKDIR /imagur/shared
RUN yarn build

WORKDIR /imagur/frontend
RUN yarn build

WORKDIR /imagur/backend
RUN yarn build

CMD ["yarn", "start:prod"]

