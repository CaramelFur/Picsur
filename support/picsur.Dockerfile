FROM node:18.8

# Sorry for the humongous docker container this generates
# Maybe I'll trim it down some day

ENV PICSUR_PRODUCTION=true

ADD . /picsur
WORKDIR /picsur

RUN yarn install --immutable

RUN yarn workspace picsur-shared build
RUN yarn workspace picsur-frontend build
RUN yarn workspace picsur-backend build

CMD yarn workspace picsur-backend start:prod
