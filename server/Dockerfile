# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

USER node

CMD ["node", "index.js"]

EXPOSE 4000