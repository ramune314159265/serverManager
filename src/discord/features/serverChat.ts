import { ColorResolvable, EmbedBuilder, Events, roleMention } from 'discord.js'
import romajiConv from '@koozaki/romaji-conv'

import { client } from '..'
import { discordBotConfig } from '../../config/discord'
import { servers } from '../../server'
import { minecraftWsServer } from '../../websocket/minecraft'
import { URLToMinimessage, minimessageNormalizer } from '../../util/minimessage'

const noticeChannel = client.channels.cache.get(discordBotConfig.noticeChannelId)
if (noticeChannel === undefined) {
	throw new Error('noticeChannel can not be found')
}
if (!noticeChannel.isTextBased()) {
	throw new Error('noticeChannel is not Text Channel')
}

minecraftWsServer.on('connection', wsConnection => {
	wsConnection.on('message', async message => {
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case 'server_started':
				if (!servers[data.serverId].attributes.notice?.start) {
					return
				}
				noticeChannel.send(`${servers[data.serverId].attributes.startMention === true ? roleMention(discordBotConfig.mentionRoleId) : ''}✅ **${servers[data.serverId].name}** が起動しました`)
				break
			case 'server_stopped':
				if (!servers[data.serverId].attributes.notice?.stop) {
					return
				}
				noticeChannel.send({
					content: `🛑 **${servers[data.serverId].name}** が停止しました`,
					flags: [4096] //https://stackoverflow.com/questions/76517603/how-to-send-a-silent-message-with-discord-js
				})
				break
			case 'player_connected': {
				if (!servers[data.joinedServerId].attributes.notice?.joinLeave) {
					return
				}
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
				if (!servers[data.joinedServerId].attributes.notice?.joinLeave) {
					return
				}
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
				minecraftWsServer.clients.forEach(wsConnection => {
					wsConnection.send(JSON.stringify({
						type: 'send_chat',
						content: `<aqua>${data.playerId}さんが${servers[data.joinedServerId].name}サーバーに参加しました`
					}))
				})
				break
			}
			case 'player_disconnected': {
				if (!servers[data.previousJoinedServerId].attributes.notice?.joinLeave) {
					return
				}
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
				if (!servers[data.serverId].attributes.notice?.death) {
					return
				}
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
				if (!servers[data.serverId].attributes.notice?.advancement) {
					return
				}
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
			case 'player_chatted': {
				try {
					const toHiragana = romajiConv(data.content).toHiragana()
					const IMEHandled = (await (await fetch(`https://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(toHiragana)}`)).json())
						.map((i: string) => i[1][0])
						.join('')
					const contentToSendMinecraft = `[<green>Minecraft</green> | <hover:show_text:'クリックしてプライベートメッセージコマンドを補完'><click:suggest_command:/tell ${data.playerId} >${data.playerId}<gray>@${servers[data.serverId].name}</gray></click></hover>] ${URLToMinimessage(data.content)} <reset><gold>(${URLToMinimessage(IMEHandled)})</gold>`
					const contentToSendDiscord = `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (${IMEHandled})`
					wsConnection.send(JSON.stringify({
						type: 'send_chat',
						content: contentToSendMinecraft
					}))
					noticeChannel.send(contentToSendDiscord)
				} catch (e) {
					const contentToSendMinecraft = `[<green>Minecraft</green> | ${data.playerId}<gray>@${servers[data.serverId].name}</gray>] ${URLToMinimessage(data.content)} <reset><red>(エラー)</red>`
					const contentToSendDiscord = `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (エラー)`
					wsConnection.send(JSON.stringify({
						type: 'send_chat',
						content: contentToSendMinecraft
					}))
					noticeChannel.send(contentToSendDiscord)
				}
				break
			}

			default:
				break
		}
	})
})

client.on(Events.MessageCreate, message => {
	if (message.channelId !== discordBotConfig.noticeChannelId) {
		return
	}
	if (message.author.system) {
		return
	}
	if (message.author.bot && /^\[Minecraft \| (.+?)\]/.test(message.content)) {
		return
	}
	if (message.content === '') {
		return
	}
	const contentToSendMinecraft = `[<color:#5865F2>Discord</color> | <${message.member?.displayHexColor ?? 'white'}><hover:show_text:'@${message.author.username}'>${message.author.displayName}</hover></${message.member?.displayHexColor ?? 'white'}>] <reset>${minimessageNormalizer(message.content)}`
	minecraftWsServer.clients.forEach(wsConnection => {
		wsConnection.send(JSON.stringify({
			type: 'send_chat',
			content: contentToSendMinecraft
		}))
	})
})
