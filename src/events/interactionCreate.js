module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()){
            const command = client.commands.get(interaction.commandName);

            if (!command) return
            
            try{
                await command.execute(interaction, client);
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!', 
                    ephemeral: true
                });
            } 
        } else if (interaction.isAutocomplete()) { 
            const command = interaction.client.commands.get(interaction.commandName); 
            if (!command) { 
                console.error( `No command matching ${interaction.commandName} was found.` ); 
                return; 
            } try { 
                await command.autocomplete(interaction); 
            } catch (error) { 
                console.error(error); 
            }
        }
    },
};