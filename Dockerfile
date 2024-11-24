FROM node:22.5.1-slim

WORKDIR /app

COPY . /app

RUN npm install --production

ENV PORT=8080

ENTRYPOINT [ "node", "app.js" ]