import { APIEmbedField, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder } from 'discord.js'

import { client } from '../..'
import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft/main'
import { statusEmojis } from '../../../util/server'

const returnServerFieldsEmbed = (canUseReloadButton: boolean): EmbedBuilder => {
	const serverFields: Array<APIEmbedField> = []
	for (const server of Object.values(servers)) {
		if (!(server instanceof MinecraftServer)) {
			continue
		}
		const field: APIEmbedField = {
			name: `${statusEmojis[server.status] ?? statusEmojis.unknown} ${server.name}`,
			value: `${server.status === 'online' ? `オンライン プレイヤーリスト:${server.players.list.join(', ')}` : 'オフライン'} `
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
		.setFooter({ text: `※現時点での情報です。更新するには${canUseReloadButton ? '下の更新ボタンを押してください' : 'もう一度/listと入力してください'}` })
	return embed
}

export default {
	data: {
		name: "list",
		description: "サーバーの情報を表示します",
	},
	async execute(interaction: CommandInteraction) {
		const message = await interaction.reply({
			embeds: [returnServerFieldsEmbed(true)],
			components: [
				new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Primary)
							.setCustomId('reload')
							.setLabel('更新')
							.setEmoji('🔃')
					)
			],
			ephemeral: true,
		})
		const collector = message.createMessageComponentCollector({ time: 14 * 50 * 1000 /*約15分間(メッセージ更新が出来る期間)*/ })

		collector.on('collect', async (buttonInteraction: ButtonInteraction) => {
			buttonInteraction.update({
				embeds: [returnServerFieldsEmbed(true)]
			})
		})

		collector.on('end', () => {
			message.edit({
				embeds: [returnServerFieldsEmbed(false)],
				components: [
					new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Secondary)
								.setCustomId('reload')
								.setLabel('更新')
								.setEmoji('🔃')
								.setDisabled(true)
						)
				]
			})
		})
	}
}
