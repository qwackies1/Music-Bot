const { ActivityType } = require('discord.js')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        await client.user.setPresence({
            activities: [{
                name: `/help | v1.0.0`,
                type: ActivityType.Listening
            }],
            status: 'online'
        })
    },
};