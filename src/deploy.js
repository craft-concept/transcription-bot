import { REST, Routes } from "discord.js";
import commands from "./commands/index.js";
import config from "./config.js";

async function deploy() {
  const rest = new REST().setToken(config.appToken);
  const commandData = commands.values().map((c) => c.data.toJSON());
  const result = await rest.put(Routes.applicationCommands(config.appId), {
    body: Array.from(commandData)
  });

  // TODO: make this useful
  if (result.length) console.log("Success!")
  else console.log("Something went wrong!")
}

await deploy();
