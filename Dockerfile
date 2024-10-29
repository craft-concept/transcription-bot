FROM ubuntu:22.04 as whispercpp

WORKDIR /build

# Make whispercpp
RUN apt-get update && \
  apt-get install -y build-essential curl \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -Lo whisper.cpp.tar.gz https://github.com/ggerganov/whisper.cpp/archive/refs/tags/v1.7.1.tar.gz && \
  tar -xvzf whisper.cpp.tar.gz --strip-components 1 && \
  make && \
  sh ./models/download-ggml-model.sh tiny.en 

# TODO: this image is large, can we use alpine or slim instead?
FROM node:22.9.0 as base

# Install runtime whisper dependencies
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y ffmpeg && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy whispercpp and add to path
COPY --from=whispercpp /build /usr/local/share/whisper.cpp
RUN ln -s /usr/local/share/whisper.cpp/main /usr/local/bin/whisper.cpp

# We bake the whipser model into the image, so might as well force this env var here :(
ENV WHISPER_MODEL=/usr/local/share/whisper.cpp/models/ggml-tiny.en.bin

WORKDIR /app

# Copy package.json(s) and install first for better layer caching
COPY package*.json .
RUN npm install

# Copy source
COPY  . .

# Give ownership of runtime directories to Node user
RUN chown -R node:node storage

# Run the application as Node user
# EXPOSE 80
USER node

# Labels
LABEL org.opencontainers.image.source=https://github.com/craft-concept/transcription-bot

CMD ["node", "src/index.js"]


