FROM node:23 as app

WORKDIR /app

COPY package*.json .

RUN npm install

COPY  .. .

LABEL org.opencontainers.image.source=https://github.com/craft-concept/transcription-bot

CMD ["node", "src/index.js"]
