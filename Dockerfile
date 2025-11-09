#Build stage

FROM node:20-alpine AS builder

RUN apk update && apk upgrade

ARG NODE_ENV=production
ENV  NODE_ENV=${NODE_ENV}



WORKDIR  /usr/src/app


COPY package*.json  ./

RUN if ["${NODE_ENV" = "development"] ||  ["${NODE_ENV" = "development"]  then \
npm install; \
else  \
npm ci; \
fi


COPY . .
RUN  npm run builder

#Production Stage
FROM node:20-alpine



ARG NODE_ENV=production
ENV  NODE_ENV=${NODE_ENV}
