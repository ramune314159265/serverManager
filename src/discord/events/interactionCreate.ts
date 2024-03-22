import {
	ChatInputCommandInteraction,
	Events,
	InteractionType
} from 'discord.js'

import { client } from '..'

client.on(Events.InteractionCreate, async interaction => {
	switch (interaction.type) {
		case InteractionType.ApplicationCommand: {
			const commandsData = (await import('../commands/index')).commandsData
			const commandData = commandsData[interaction.commandName]
			try {
				if (!(interaction instanceof ChatInputCommandInteraction)) {
					throw new Error('interaction is not ChatInputCommandInteraction')
				}
				if (interaction.options.getSubcommand(false)) {
					(await import(`../commands/${interaction.commandName}/${interaction.options.getSubcommand()}`)).execute(interaction)
					return
				}
				commandData.execute(interaction)
			} catch (e) {
				console.error(e)
				await interaction.reply({
					content: 'コマンドを実行中にエラーが発生しました' + e,
					ephemeral: true,
				})
			}
			break
		}


		default:
			break
	}
})
