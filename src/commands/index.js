import join from "./join.js";
import { Collection } from "discord.js";

const commands = new Collection();
commands.set(join.data.name, join);

export default commands;
