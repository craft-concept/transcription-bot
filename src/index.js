// import { getVoiceConnection } from "@discordjs/voice";
import { Events, Client, GatewayIntentBits } from "discord.js";
import config from "./config.js";
import commands from "./commands/index.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// TODO: connection error handling
client.on(Events.ClientReady, () => console.log("Ready!"));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  try {
    if (command) {
      await command.execute(interaction);
    } else {
      await interaction.reply("Unknown command");
    }
  } catch (error) {
    console.warn(error);
  }
});

client.on(Events.Error, console.warn);
client.login(config.appToken);
