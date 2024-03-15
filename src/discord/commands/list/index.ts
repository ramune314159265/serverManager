import { APIEmbedField, CommandInteraction, EmbedBuilder } from 'discord.js'
import { client } from '../..'
import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft'
import { statusEmojis } from '../../../util/server'

export default {
	data: {
		name: "list",
		description: "サーバーの情報を表示します",
	},
	async execute(interaction: CommandInteraction) {
		const serverFields: Array<APIEmbedField> = []
		for (const server of Object.values(servers)) {
			if (!(server instanceof MinecraftServer)) {
				continue
			}
			const field: APIEmbedField = {
				name: `${statusEmojis[server.status] ?? statusEmojis.unknown} ${server.name}`,
				value: `${server.status === 'online' ? 'オンライン' : 'オフライン'} プレイヤーリスト:${server.players.list.join(', ')}`
			}
			serverFields.push(field)
		}
		const embed = new EmbedBuilder()
			.setTitle('サーバー情報')
			.setAuthor(
				{
					name: 'ラムネサーバー',
					iconURL: client.user?.displayAvatarURL()
				}
			)
			.setFields(...serverFields)
			.setColor('#58b058')
			.setTimestamp()
			.setFooter({ text: '※現時点での情報です。更新するにはもう一度/listと入力してください' })
		await interaction.reply({ embeds: [embed], ephemeral: true })
	}
}
