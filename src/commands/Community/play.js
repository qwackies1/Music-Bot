const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays a song")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("search for...")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((option) => {
      option
        .setName("input")
        .setDescription("search for music")
        .setRequired(true);
    }),

  async autocomplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const choices = ["song", "playlist", "keywords"];
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },

  async execute(interaction, client) {
    const mustBeInVC = new EmbedBuilder()
      .setColor("Red")
      .setDescription("You must be in a voice channel to play a song.");

    const noResults = new EmbedBuilder()
      .setColor("Red")
      .setDescription("No results found!");

    const noPlaylist = new EmbedBuilder()
      .setColor("Red")
      .setDescription("No playlist found!");

    let addedSongToQueue = new EmbedBuilder();

    if (!interaction.member.voice.channel) {
      await interaction.reply({ embeds: [mustBeInVC] });
      return;
    }

    const queue = await client.player.createQueue(interaction.guild);

    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    if (interaction.options.getString() == "song") {
      const url = interaction.options.getString("input");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length == 0) {
        await interaction.reply({ embeds: [noResults] });
        return;
      }

      const song = result.tracks[0];
      await queue.addTrack(song);

      addedSongToQueue
        .setColor("Green")
        .setTitle(`Added **${song.title}** to the queue`)
        .setImage(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` })
        .setTimestamp();
    } else if (interaction.options.getString() == "playlist") {
      let url = interaction.options.getString("input");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return await interaction.reply({ embeds: [noPlaylist] });

      // Add the tracks to the queue
      const playlist = result.playlist;
      await queue.addTracks(result.tracks);

      addedSongToQueue
        .setColor("Green")
        .setTitle(`Added **${playlist.title}** to the queue`)
        .setURL(playlist.url)
        .setImage(playlist.thumbnail.url)
        .setFooter({
          text: `Loaded ${String(
            playlist.tracks.length
          )} songs | Playlist made ${String(playlist.author.name)}`,
        })
        .setTimestamp();
    } else if (interaction.options.getString() == "search") {
      const url = interaction.options.getString("input");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length == 0) {
        await interaction.reply({ embeds: [noResults] });
        return;
      }

      const song = result.tracks[0];
      await queue.addTrack(song);

      addedSongToQueue
        .setColor("Green")
        .setTitle(`Added **${song.title}** to the queue`)
        .setImage(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` })
        .setTimestamp();
    }

    if (!queue.playing) await queue.play();

    await interaction.reply({ embeds: [addedSongToQueue] });
  },
};
