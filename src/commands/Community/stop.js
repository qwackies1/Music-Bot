const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the bot.'),

    async execute(interation, client){
        const noSongs = new EmbedBuilder()
            .setColor('Red')
            .addFields({ name: 'Error!', value: 'There are no songs currently playing!' })
        
        let stopped = new EmbedBuilder()
            .setColor('Green')
            .setDescription('Successfully exited the voice channel.')
            .setTimestamp()

        const queue = client.player.getQueue(interation.guild)

        if(!queue) return await interation.reply({ embeds: [noSongs] })

        queue.destroy();

        await interation.reply({ embeds: [stopped] })
    }
}