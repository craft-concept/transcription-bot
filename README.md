# TranscriptionBot

## Use

In Discord, run `/join` in a voice channel to have transcription-bot join voice and transcribe all speech.

## Building

The `compose.yml` files contain all of the configuration required to build the different images.

To build transcription-bot without GPU-acceleration:

```
docker compose build
```

To build transcription-bot with CUDA GPU-acceleration (which can take awhile!)

```
docker compose -f cuda.compose.yml build
```

## Running

### Docker

Overview:

1. Pull a docker image (`:latest` for cpu, `:cuda` for CUDA acceleration)
2. Create a volume and download a ggml model to it
3. Create a local `.env` file and fill out the appropriate values. See `example.env` for a template and docs.
4. Register the application commands with Discord.
5. Run the container

#### CPU

```

# Pull the image

docker pull ghcr.io/craft-concept/transcription-bot:latest

# Create a volume for models and mount it in the container. The volume name and the mount path dont matter (and do not need to match each other), as long as they are consistent throughout the commands below. Then, download a model to the volume

# You can run download-ggml-model.sh without any arguments to see available

# models

docker run -it --rm -v models:/models transcription-bot:latest download-ggml-model.sh base.en /models

# Create a local `.env` file and fill out its values

# The `WHISPER_MODEL` env var should reflect the model you downloaded in the previous command and the

# path at which is was placed. You must append a `ggml-` prefix to the model name and a `.bin` extension

# to the model name

# For example, for the command above the value would be

# WHISPER_MODEL=/models/ggml-base.en.bin

cp example.env .env
vim .env # Or whatever editor you prefer

# Register transcription-bot's commands with Discord

# Note that you may need to refresh Discord (quite and reopen) if it is open when you run this command. Otherwise

# you may not find the `/join` command available in Discord or you'll receive an error response "Unknown Integration"

docker run -v models:/models --env-file=.env transcription-bot:latest npm run deploy-commands

# Run transcription-bot

docker run -v models:/models --env-file=.env transcription-bot:latest

```

#### CUDA

The only difference from the CPU steps above is to provide the docker containers with GPU resources. You can do this by adding `--gpus=all` to the ultimate `docker run` command which runs the container.

```

# Pull the image

docker pull ghcr.io/craft-concept/transcription-bot:cuda

# Run transcription-bot with GPU resources

docker run -v models:/models --env-file=.env --gpus=all transcription-bot:cuda

# Create a volume for models and mount it in the container. The volume name and the mount path dont matter (and do not need to match each other), as long as they are consistent throughout the commands below. Then, download a model to the volume

# You can run download-ggml-model.sh without any arguments to see available

# models

docker run -it --rm -v models:/models transcription-bot:cuda download-ggml-model.sh base.en /models

# Create a local `.env` file and fill out its values

# The `WHISPER_MODEL` env var should reflect the model you downloaded in the previous command and the

# path at which is was placed. You must append a `ggml-` prefix to the model name and a `.bin` extension

# to the model name

# For example, for the command above the value would be

# WHISPER_MODEL=/models/ggml-base.en.bin

cp example.env .env
vim local.env

# Register transcription-bot's commands with Discord

docker run -v models:/models --env-file=.env transcription-bot:cuda npm run deploy-commands

# Run transcription-bot with gpu resources

docker run -v models:/models --env-file=.env --gpus=all transcription-bot:cuda

```

```

```
