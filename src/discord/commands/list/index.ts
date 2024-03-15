import { CommandInteraction, EmbedBuilder } from 'discord.js'

export default {
	data: {
		name: "list",
		description: "サーバーの情報を表示します",
	},
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle('サーバー情報')
			.setAuthor(
				{
					name: 'ラムネサーバー'
				}
			)
			.setColor('#58b058')
			.setTimestamp()
			.setFooter({ text: '※現時点での情報です。更新するにはもう一度/listと入力してください' })
		await interaction.reply({ embeds: [embed], ephemeral: true })
	}
}
