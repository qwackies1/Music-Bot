const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Checks your queue'),

    async execute(interaction, client){
        const queue = client.player.getQueue(interaction.guild)
        const noSongsInQueue = new EmbedBuilder()
            .setColor('Red')
            .addFields({ name: 'Error!', value: 'There are no songs in the queue!' })
        
        const currentlyPlaying = new EmbedBuilder()

        if(!queue || !queue.playing) return await interaction.reply({ embeds: [noSongsInQueue] })

        const queueString = queue.tracks.splice(0, 10).map((song, i) => {
            return `${i + 1}) [${song.duration}] - **${song.title}**`
        }).join('\n')

        const currentSong = queue.current;

        currentlyPlaying
            .setTitle(`**Currently Playing**: ` + (currentSong ? `[${currentSong.duration}] **${currentSong.title}**` : "None"))
            .setDescription(`**Queue**\n${queueString}`)
            .setColor('Green')
            .setImage(currentSong.thumbnail)
            .setTimestamp()

        await interaction.reply({ embeds: [currentlyPlaying] })
    }
}