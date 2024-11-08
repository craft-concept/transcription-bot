ARG UBUNTU_VERSION=24.04
# This needs to generally match the container host's environment.
ARG CUDA_VERSION=12.6.2
# Target the CUDA runtime image
ARG BASE_CUDA_RUN_CONTAINER=nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu${UBUNTU_VERSION}

FROM whispercpp-cuda as whispercpp

FROM ${BASE_CUDA_RUN_CONTAINER} as app

# Copy whispercpp and add to path
COPY --from=whispercpp /app /usr/local/share/whisper.cpp

WORKDIR /app
COPY package*.json .

RUN ln -s /usr/local/share/whisper.cpp/main /usr/local/bin/whisper.cpp && \
    apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential ffmpeg curl && \
    curl -fsSL https://deb.nodesource.com/setup_23.x | bash - && \
    apt-get install -y nodejs  && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
    npm install

# Copy source
COPY  . .

CMD ["node", "src/index.js"]