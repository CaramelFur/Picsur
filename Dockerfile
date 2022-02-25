FROM node:16-alpine

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

