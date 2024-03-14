import { CommandInteraction } from 'discord.js'

export default {
	data: {
		name: 'start',
		description: 'サーバーを起動します'
	},
	async execute(interaction: CommandInteraction) {
		interaction.reply('test')
	}
}
