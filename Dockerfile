FROM node:22.5.1-slim

WORKDIR /app

COPY . /app

RUN npm install --production

ENV PORT=8080

EXPOSE 3000

ENTRYPOINT [ "node", "app.js" ]