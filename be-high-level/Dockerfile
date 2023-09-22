# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

USER node

CMD ["node", "./src/index.js"]

EXPOSE 4000