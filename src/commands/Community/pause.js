const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the song you are on.'),

    async execute(interation, client){
        const noSongs = new EmbedBuilder()
            .setColor('Red')
            .addFields({ name: 'Error!', value: 'There are no songs currently playing!' })
        
        let paused = new EmbedBuilder()
            .setColor('Green')
            .setDescription('You have successfully paused your song')
            .setTimestamp()

        const queue = client.player.getQueue(interation.guild)

        if(!queue) return await interation.reply({ embeds: [noSongs] })

        queue.setPaused(true);

        await interation.reply({ embeds: [paused] })
    }
}