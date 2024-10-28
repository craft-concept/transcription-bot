import path from "node:path";
import config from "./config.js";

export function filename(name, extension) {
  const now = new Date();
  const dateString = now.toISOString().replace(/[:.]/g, "-").slice(0, -1);
  return path.join(config.storageDir, `${name}-${dateString}.${extension}`);
}
