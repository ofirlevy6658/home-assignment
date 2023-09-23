# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production

COPY . .


USER node

CMD ["node", "./src/index.js"]

EXPOSE 4000