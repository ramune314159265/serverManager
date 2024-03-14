import { ColorResolvable, EmbedBuilder } from 'discord.js'
import { client } from '..'
import { discordBotConfig } from '../../config/discord'
import { servers } from '../../server'
import { minecraftWsServer } from '../../websocket/minecraft'

const noticeChannel = client.channels.cache.get(discordBotConfig.noticeChannelId)
if (noticeChannel === undefined) {
	throw new Error('noticeChannel can not be found')
}
if (!noticeChannel.isTextBased()) {
	throw new Error('noticeChannel is not Text Channel')
}

minecraftWsServer.on('connection', wsConnection => {
	wsConnection.on('message', message => {
		const data = JSON.parse(message.toString())
		console.log(data)
		switch (data.type) {
			case 'server_started':
				noticeChannel.send(`✅ **${servers[data.serverId].name}** が起動しました`)
				break
			case 'server_stopped':
				noticeChannel.send({
					content: `🛑 **${servers[data.serverId].name}** が停止しました`,
					flags: [4096] //https://stackoverflow.com/questions/76517603/how-to-send-a-silent-message-with-discord-js
				})
				break
			case 'player_connected': {
				const embed = new EmbedBuilder()
				embed.setAuthor({
					name: servers[data.joinedServerId].name,
					iconURL: client.user?.displayAvatarURL()
				})
				embed.setTitle(`${data.playerId}さんがサーバーに参加しました`)
				embed.setColor(discordBotConfig.colors.join)
				embed.setTimestamp(new Date(data.timestamp))
				noticeChannel.send({
					embeds: [embed]
				})
				break
			}
			case 'player_moved': {
				const embed = new EmbedBuilder()
				embed.setAuthor({
					name: servers[data.joinedServerId].name,
					iconURL: client.user?.displayAvatarURL()
				})
				embed.setTitle(`${data.playerId}さんがサーバーに移動しました`)
				embed.setColor(discordBotConfig.colors.move)
				embed.setTimestamp(new Date(data.timestamp))
				noticeChannel.send({
					embeds: [embed]
				})
				break
			}
			case 'player_disconnected': {
				const embed = new EmbedBuilder()
				embed.setAuthor({
					name: servers[data.previousJoinedServerId].name,
					iconURL: client.user?.displayAvatarURL()
				})
				embed.setTitle(`${data.playerId}さんがサーバーから退出しました`)
				embed.setColor(discordBotConfig.colors.leave)
				embed.setTimestamp(new Date(data.timestamp))
				noticeChannel.send({
					embeds: [embed]
				})
				break
			}
			case 'player_died': {
				const embed = new EmbedBuilder()
				embed.setAuthor({
					name: servers[data.serverId].name,
					iconURL: client.user?.displayAvatarURL()
				})
				embed.setTitle(data.reason)
				embed.setDescription('なんだとぉ'/*伝統*/)
				embed.setColor(discordBotConfig.colors.death as ColorResolvable)
				embed.setTimestamp(new Date(data.timestamp))
				noticeChannel.send({
					embeds: [embed]
				})
				break
			}
			case 'player_advancement_done': {
				const embed = new EmbedBuilder()
				embed.setAuthor({
					name: servers[data.serverId].name,
					iconURL: client.user?.displayAvatarURL()
				})
				embed.setTitle(`${data.playerId}さんは${data.advancement.type === 'CHALLENGE' ? '挑戦' : '進捗'} ${data.advancement.name} を達成した`)
				embed.setDescription(data.advancement.description)
				embed.setColor(data.advancement.type === 'CHALLENGE' ? discordBotConfig.colors.challengeAdvancement : discordBotConfig.colors.normalAdvancement)
				embed.setTimestamp(new Date(data.timestamp))
				noticeChannel.send({
					embeds: [embed]
				})
				break
			}

			default:
				break
		}
	})
})
