FROM whispercpp as whispercpp

FROM node:23 as app

# Copy whispercpp and add to path
COPY --from=whispercpp /app /usr/local/share/whisper.cpp

WORKDIR /app
COPY package*.json .

RUN ln -s /usr/local/share/whisper.cpp/main /usr/local/bin/whisper.cpp && \
  apt-get update -qq && \
  apt-get install --no-install-recommends -y curl ffmpeg && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
  npm install

# Copy source
COPY  .. .

LABEL org.opencontainers.image.source=https://github.com/craft-concept/transcription-bot

CMD ["node", "src/index.js"]
