import {
	ColorResolvable,
	EmbedBuilder,
	Events,
	TimestampStyles,
	roleMention,
	time
} from 'discord.js'
import romajiConv from '@koozaki/romaji-conv'

import { client } from '..'
import { discordBotConfig } from '../../config/discord'
import { servers } from '../../server'
import {
	URLToMinimessage,
	discordUserNameNormalizer,
	minecraftUserNameNormalizer,
	minimessageNormalizer
} from '../../util/minimessage'
import { MinecraftServer } from '../../server/minecraft'
import {
	playerAdvancementDoneEvent,
	playerChattedEvent,
	playerConnectedEvent,
	playerDeadEvent,
	playerDisconnectedEvent,
	playerMovedEvent,
	serverHangedEvent
} from '../../server/interfaces'
import { translateFromAdvancementData } from '../../util/minecraft'

const noticeChannel = client.channels.cache.get(discordBotConfig.noticeChannelId)
if (noticeChannel === undefined) {
	throw new Error('noticeChannel can not be found')
}
if (!noticeChannel.isTextBased()) {
	throw new Error('noticeChannel is not Text Channel')
}

for (const server of Object.values(servers)) {
	if (!(server instanceof MinecraftServer)) {
		continue
	}
	server.on('minecraft.started', () => {
		if (!server.attributes.notice?.start) {
			return
		}
		noticeChannel.send(`${server.attributes.startMention === true ? roleMention(discordBotConfig.mentionRoleId) : ''}✅ **${server.name}** が起動しました`)
		MinecraftServer.sendChatToAll(`<aqua><bold>${server.name}</bold>が起動しました`)
	})

	server.on('minecraft.stopped', () => {
		if (!server.attributes.notice?.stop) {
			return
		}
		noticeChannel.send({
			content: `🛑 **${server.name}** が停止しました`,
			flags: [4096] //https://stackoverflow.com/questions/76517603/how-to-send-a-silent-message-with-discord-js
		})
		MinecraftServer.sendChatToAll(`<aqua><bold>${server.name}</bold>が停止しました`)
	})

	server.on('minecraft.player.connected', (data: playerConnectedEvent) => {
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
		server.sendChat(`<aqua>${data.playerId}さんが<bold>${servers[data.joinedServerId].name}</bold>に参加しました`)
	})

	server.on('minecraft.player.moved', (data: playerMovedEvent) => {
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
		server.sendChat(`<aqua>${data.playerId}さんが<bold>${servers[data.joinedServerId].name}</bold>に参加しました`)
	})

	server.on('minecraft.player.disconnected', (data: playerDisconnectedEvent) => {
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
	})

	server.on('minecraft.player.died', (data: playerDeadEvent) => {
		if (!server.attributes.notice?.death) {
			return
		}
		const embed = new EmbedBuilder()
		embed.setAuthor({
			name: server.name,
			iconURL: client.user?.displayAvatarURL()
		})
		embed.setTitle(data.reason)
		embed.setDescription('なんだとぉ'/*伝統*/)
		embed.setColor(discordBotConfig.colors.death as ColorResolvable)
		embed.setTimestamp(new Date(data.timestamp))
		noticeChannel.send({
			embeds: [embed]
		})
	})

	server.on('minecraft.player.advancementDone', (data: playerAdvancementDoneEvent) => {
		if (!server.attributes.notice?.advancement) {
			return
		}
		const advancementTypes: { [key: string]: string } = {
			'CHALLENGE': '挑戦',
			'GOAL': '目標',
			'TASK': '進捗'
		}
		const translatedData = translateFromAdvancementData(data.advancement)
		const embed = new EmbedBuilder()
		embed.setAuthor({
			name: server.name,
			iconURL: client.user?.displayAvatarURL()
		})
		embed.setTitle(`${data.playerId}さんは${advancementTypes[data.advancement.type] ?? '進捗'} ${translatedData.name} を達成しました`)
		embed.setDescription(translatedData.description)
		embed.setColor(data.advancement.type === 'CHALLENGE' ? discordBotConfig.colors.challengeAdvancement : discordBotConfig.colors.normalAdvancement)
		embed.setTimestamp(new Date(data.timestamp))
		noticeChannel.send({
			embeds: [embed]
		})
	})

	server.on('minecraft.player.chatted', async (data: playerChattedEvent) => {
		try {
			const toHiragana = romajiConv(data.content).toHiragana()
			const IMEHandled = (await (await fetch(`https://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(toHiragana)}`)).json())
				.map((i: string) => i[1][0])
				.join('')
			const contentToSendMinecraft = `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] ${URLToMinimessage(data.content)} <reset><gold>(${URLToMinimessage(IMEHandled)})</gold>`
			const contentToSendDiscord = `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (${IMEHandled})`
			server.sendChat(contentToSendMinecraft)
			noticeChannel.send(contentToSendDiscord)
		} catch (e) {
			const contentToSendMinecraft = `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] ${URLToMinimessage(data.content)} <reset><red>(エラー)</red>`
			const contentToSendDiscord = `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (エラー)`
			server.sendChat(contentToSendMinecraft)
			noticeChannel.send(contentToSendDiscord)
		}
	})

	server.on('minecraft.server.hanged', async (data: serverHangedEvent) => {
		if (!server.attributes.notice?.hang) {
			return
		}
		noticeChannel.send({
			content: `‼️ **${server.name}** は${time(new Date(data.lastTickTimestamp), TimestampStyles.RelativeTime)}から応答がありません!`
		})
		MinecraftServer.sendChatToAll(`<red><bold>${server.name}</bold>は${Math.round((data.timestamp - data.lastTickTimestamp) / 1000)}秒以上応答がありません!`)
	})
}

client.on(Events.MessageCreate, async message => {
	if (message.channelId !== discordBotConfig.noticeChannelId) {
		return
	}
	if (message.author.system) {
		return
	}
	if (message.author.bot && message.author.id === client.user?.id) {
		return
	}
	if (message.content === '') {
		return
	}
	const repliedMessage = message.reference?.messageId ? await message.channel.messages.fetch(message.reference?.messageId) : null
	const contentToSendMinecraft = `[<color:#5865F2>Discord</color> | ${discordUserNameNormalizer(message.member)}${repliedMessage ? `(${discordUserNameNormalizer(repliedMessage.member)}に返信)` : ''}] <reset>${minimessageNormalizer(message.content, message.guild)}`
	MinecraftServer.sendChatToAll(contentToSendMinecraft)
})
