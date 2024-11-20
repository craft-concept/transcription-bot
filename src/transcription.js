import Fs from "node:fs/promises";
import config from "./config.js";

export async function transcribe(filename) {
  const result = await inference(filename)
  console.log(result)
  return
}

async function inference(filename) {
  const request = await inferenceRequest(filename)
  return send(request)
}

async function send(request) {
  const response = await fetch(request);
  return response.json();
}

async function inferenceRequest(recording) {
  const form = await formData(recording);
  return new Request(`${config.whisperUrl}/inference`, {
    method: "POST",
    body: form,
    headers: {
      Accept: "application/json",
    },
  });
}

async function formData(recording) {
  const form = new FormData();
  form.set("file", await readBlob(recording.filename), "test.wav");
  return form;
}

async function readBlob(filename) {
  const buffer = await Fs.readFile(filename);
  return new Blob([buffer]);
}
