const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the song you are on.'),

    async execute(interation, client){
        const noSongs = new EmbedBuilder()
            .setColor('Red')
            .addFields({ name: 'Error!', value: 'There are no songs currently playing!' })
        
        let skippedSong = new EmbedBuilder()

        const queue = client.player.getQueue(interation.guild)

        if(!queue) return await interation.reply({ embeds: [noSongs] })

        const currentSong = queue.current;

        queue.skip();

        skippedSong
            .setDescription(`Skipped **${currentSong.title}**`)
            .setColor('Green')
            .setImage(currentSong.thumbnail)
            .setTimestamp()

        await interation.reply({ embeds: [skippedSong] })
    }
}