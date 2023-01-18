const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the song you are on."),

  async execute(interaction, client) {
    const noSongs = new EmbedBuilder()
        .setColor("Red")
        .addFields({
            name: "Error!",
            value: "There are no songs currently playing!",
        });

    let resume = new EmbedBuilder()
      .setColor("Green")
      .setDescription("You have successfully resumed your song")
      .setTimestamp();

    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.reply({ embeds: [noSongs] });

    queue.setPaused(false);

    await interaction.reply({ embeds: [resume] });
  },
};
