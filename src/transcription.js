import util from "node:util";
import ChildProcess from "node:child_process";
import Fs from "node:fs/promises";
import config from "./config.js";

const execFile = util.promisify(ChildProcess.execFile);

// TODO: better filename?
// Assumes whisper.cpp is in PATH
async function execWhisper(wavFilename) {
  const outputFilename = `${wavFilename}.transcript`;
  const result = await execFile("whisper.cpp", [
    "--output-json",
    "--model",
    config.whisperModel,
    "--file",
    wavFilename,
    "--output-file",
    outputFilename,
  ]);
  // We force json output
  return `${outputFilename}.json`;
}

export async function parseTranscript(filename) {
  const file = await Fs.readFile(filename);
  const json = JSON.parse(file);
  const transcript = json.transcription.reduce((accum, part) => (accum += part.text), "");
  return transcript;
}

export async function transcribe(filename) {
  const outputFilename = await execWhisper(filename);
  return parseTranscript(outputFilename);
}
