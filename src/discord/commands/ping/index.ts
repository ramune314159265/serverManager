import { CommandInteraction, EmbedBuilder, time, TimestampStyles } from 'discord.js'
import { startAt } from '../../index'
export default {
	data: {
		name: 'ping',
		description: '応答速度測定'
	},
	async execute(interaction: CommandInteraction) {
		const embed = new EmbedBuilder()
			.setTitle(interaction.client.user.tag)
			.setColor('#58b058')
			.addFields(
				{
					name: '起動時間',
					value: `${time(new Date(startAt), TimestampStyles.RelativeTime)}(${time(new Date(startAt), TimestampStyles.LongDateTime)})`
				},
				{
					name: 'Ping',
					value: `${interaction.client.ws.ping}ms`
				},
				{
					name: 'メモリ使用量',
					value: `${process.memoryUsage().rss / 1000000}MB`
				},
			)
		await interaction.reply({ embeds: [embed], ephemeral: true })
	}
}
