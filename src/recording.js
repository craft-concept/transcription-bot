import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import prismMedia from "prism-media";
import config from "./config.js";
import path from "node:path";
import * as Storage from "./storage.js";
import * as Voice from "./voice.js";

const { opus, FFmpeg } = prismMedia;

export function isRecording(receiver, user) {
  return Voice.hasSubscription(receiver, user);
}

export async function record(receiver, user) {
  const voiceStream = Voice.subscribe(receiver, user);
  const filename = Storage.filename(user.username, "wav");
  const res = await streamToFile(voiceStream, filename);
  return filename;
}

function decoder() {
  return new opus.Decoder({
    channels: 2,
    rate: 48000,
  });
}

// Transcode to 16k for compatibility with whisper.cpp main
// media-prism FFmpeg is busted - manually pass input flags to ensure configuration is correctly applied to input
function transcoder() {
  return new FFmpeg({
    args: ["-f", "s16le", "-ar", "48k", "-ac", "2", "-i", "-", "-ar", "16k", "-f", "wav"],
  });
}

function fileWriter(filename) {
  return createWriteStream(filename);
}

function streamToFile(opusStream, filename) {
  return pipeline(opusStream, decoder(), transcoder(), fileWriter(filename));
}
