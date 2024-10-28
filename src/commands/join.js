import { setTimeout } from "node:timers/promises";
import { SlashCommandBuilder, GuildMember, ChannelType, MessageFlags } from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import * as Voice from "../voice.js";
import * as Recording from "../recording.js";
import * as Transcription from "../transcription.js";

export default {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join your current voice channel and transcribe the conversation."),

  async execute(interaction) {
    const channel = interaction.channel;

    if (!channel || channel.type != ChannelType.GuildVoice) {
      await interaction.reply({
        content: "I only work in voice channels!",
      });
      return;
    }

    await interaction.reply({ content: "On my way!", ephemeral: true });

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: false,
      selfMute: true,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, async () => {
      const { receiver } = connection;

      receiver.speaking.on("start", async (userId) => {
        const user = interaction.client.users.cache.get(userId);

        // Prevent parallel recordings to avoid duplicate transcriptions
        if (Recording.isRecording(receiver, user)) return;
        const recording = await Recording.record(receiver, user);
        const transcript = await Transcription.transcribe(recording);

        if (!transcript) return;
        channel.send({
          content: `**${user.username}**: ${transcript}`,
          flags: MessageFlags.SuppressNotifications,
        });
      });
    });
    connection.on("stateChange", (oldState, newState) => {
      console.debug(`Connection transitioned from ${oldState.status} to ${newState.status}`);
    });
    connection.on(VoiceConnectionStatus.Connecting, () => {
      console.debug("connecting");
    });
    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.debug("disconnected");
      connection.destroy();
    });
  },
};
