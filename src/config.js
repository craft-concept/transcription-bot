import Path from "node:path";

export default {
  appToken: process.env.APP_TOKEN,
  appId: process.env.APP_ID,
  afterSilenceDuration: 1500,
  storageDir: Path.join(process.cwd(), "storage"),
  whisperModel: process.env.WHISPER_MODEL,
};
