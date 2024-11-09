FROM ubuntu:22.04 as whispercpp

WORKDIR /build

# Make whispercpp
RUN apt-get update && \
  apt-get install -y build-essential curl \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -Lo whisper.cpp.tar.gz https://github.com/ggerganov/whisper.cpp/archive/refs/tags/v1.7.1.tar.gz && \
  tar -xvzf whisper.cpp.tar.gz --strip-components 1 && \
  make

FROM node:23 as app

# Copy whispercpp and add to path
COPY --from=whispercpp /build /usr/local/share/whisper.cpp

WORKDIR /app

COPY package*.json .

RUN ln -s /usr/local/share/whisper.cpp/main /usr/local/bin/whisper.cpp && \
  ln -s /usr/local/share/whisper.cpp/models/download-ggml-model.sh /usr/local/bin/download-ggml-model.sh && \
  apt-get update -qq && \
  apt-get install --no-install-recommends -y curl ffmpeg && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
  npm install

# Copy source
COPY  .. .

LABEL org.opencontainers.image.source=https://github.com/craft-concept/transcription-bot

CMD ["node", "src/index.js"]
