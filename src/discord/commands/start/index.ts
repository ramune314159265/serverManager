import {
	ActionRowBuilder,
	CommandInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder
} from 'discord.js'

import { servers } from '../../../server'
import { statusEmojis } from '../../../util/server'


const returnServersMenuOptions = (): Array<StringSelectMenuOptionBuilder> => {
	const serversMenuOptions = []
	for (const server of Object.values(servers)) {
		if (!server.attributes.isStartableFromDiscord) {
			continue
		}
		const menuOption = new StringSelectMenuOptionBuilder()
			.setLabel(server.name)
			.setEmoji(statusEmojis[server.status] ?? statusEmojis.unknown)
			.setValue(server.id)
		if(!server.machine.isOnline){
			menuOption.setDescription('現在マシンがオフラインです')
		}
		serversMenuOptions.push(menuOption)
	}
	return serversMenuOptions
}

export default {
	data: {
		name: 'start',
		description: 'サーバーを起動します'
	},
	async execute(interaction: CommandInteraction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('startserverselect')
			.setPlaceholder('ここを押して起動するサーバーを選択')
			.setOptions(...returnServersMenuOptions())

		const message = await interaction.reply({
			content: `起動するサーバーを選んでください\n${statusEmojis.offline}: オフライン\n${statusEmojis.booting}: 起動中\n${statusEmojis.online}: オンライン`,
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>()
					.addComponents(select)
			],
			ephemeral: true
		})
		const collector = message.createMessageComponentCollector({ time: 5 * 60 * 60 * 1000 /*5時間*/ })

		collector.on('collect', async (selectMenuInteraction: StringSelectMenuInteraction) => {
			const selectedServer = servers[selectMenuInteraction.values[0]]
			try {
				selectedServer.start()
				setTimeout(async () => {
					const select = new StringSelectMenuBuilder()
						.setCustomId('startserverselect')
						.setPlaceholder('ここを押して起動するサーバーを選択')
						.setOptions(...returnServersMenuOptions())
					await selectMenuInteraction.update({
						components: [
							new ActionRowBuilder<StringSelectMenuBuilder>()
								.addComponents(select)
						]
					})
					await selectMenuInteraction.followUp({
						content: `${selectedServer.name}を起動中です。これには数分かかります。`,
						ephemeral: true
					})
				}, 1000)
			} catch (e) {
				console.error(e)
				const select = new StringSelectMenuBuilder()
					.setCustomId('startserverselect')
					.setPlaceholder('ここを押して起動するサーバーを選択')
					.setOptions(...returnServersMenuOptions())
				await selectMenuInteraction.update({
					content: '起動するサーバーを選んでください\n🔴: オフライン\n🟡: 起動中\n🟢: オンライン',
					components: [
						new ActionRowBuilder<StringSelectMenuBuilder>()
							.addComponents(select)
					]
				})
				await selectMenuInteraction.followUp({
					content: `エラーが発生しました` + e,
					ephemeral: true
				})
			}
		})
	}
}
