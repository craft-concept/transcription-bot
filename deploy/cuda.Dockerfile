# TODO: use ubi instead?
ARG UBUNTU_VERSION=24.04
ARG CUDA_VERSION=12.6.2
# Target the CUDA runtime image
ARG BASE_CUDA_RUN_CONTAINER=nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu${UBUNTU_VERSION}
# Target the CUDA build image
ARG BASE_CUDA_BUILD_CONTAINER=nvidia/cuda:${CUDA_VERSION}-devel-ubuntu${UBUNTU_VERSION}

FROM ${BASE_CUDA_BUILD_CONTAINER} as build

WORKDIR /app

ARG CUDA_DOCKER_ARCH=all
# Set nvcc architecture
ENV CUDA_DOCKER_ARCH=${CUDA_DOCKER_ARCH}
# Enable cuBLAS
ENV GGML_CUDA=1

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential curl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
    curl -Lo whisper.cpp.tar.gz https://github.com/ggerganov/whisper.cpp/archive/refs/tags/v1.7.1.tar.gz && \
    tar -xvzf whisper.cpp.tar.gz --strip-components 1 && \
    make -j 6 main quantize

FROM ${BASE_CUDA_RUN_CONTAINER} as app

ARG NODE_VERSION=23

# Copy whispercpp and add to path
COPY --from=build /app /usr/local/share/whisper.cpp

WORKDIR /app
COPY package*.json .

RUN ln -s /usr/local/share/whisper.cpp/main /usr/local/bin/whisper.cpp && \
    apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential ffmpeg curl && \
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives && \
    npm install

# Copy source
COPY  .. .

CMD ["node", "src/index.js"]