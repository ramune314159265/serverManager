import {
	ColorResolvable,
	EmbedBuilder,
	Events,
	TimestampStyles,
	roleMention,
	time
} from 'discord.js'

import { client } from '..'
import { discordBotConfig } from '../../config/discord'
import { servers } from '../../server'
import {
	playerAdvancementDoneEvent,
	playerChattedEvent,
	playerConnectedEvent,
	playerDeadEvent,
	playerDisconnectedEvent,
	playerMovedEvent,
	serverHangedEvent
} from '../../server/interfaces'
import { MinecraftServer } from '../../server/minecraft/main'
import { japaneseNormalizer } from '../../util/japanese'
import { translateFromAdvancementData, translateFromDeathMessage } from '../../util/minecraft'
import {
	diceCommandToMinimessage,
	discordUserNameNormalizer,
	minimessageNormalizer
} from '../../util/minimessage'
import { statusEmojis } from '../../util/server'

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
		noticeChannel.send(`${server.attributes.startMention === true ? roleMention(discordBotConfig.mentionRoleId) : ''}${statusEmojis.online} **${server.name}** が起動しました`)
		server.proxy.sendChat(`<aqua><bold>${server.name}</bold>が起動しました`)
	})

	server.on('minecraft.stopped', () => {
		if (!server.attributes.notice?.stop) {
			return
		}
		noticeChannel.send({
			content: `${statusEmojis.offline} **${server.name}** が停止しました`,
			flags: [4096] //https://stackoverflow.com/questions/76517603/how-to-send-a-silent-message-with-discord-js
		})
		server.proxy.sendChat(`<aqua><bold>${server.name}</bold>が停止しました`)
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
		noticeChannel.send({
			embeds: [embed]
		})
		server.proxy.sendChat(`<aqua>${data.playerId}さんが<bold>${servers[data.joinedServerId].name}</bold>に参加しました`)
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
		noticeChannel.send({
			embeds: [embed]
		})
		server.proxy.sendChat(`<aqua>${data.playerId}さんが<bold>${servers[data.joinedServerId].name}</bold>に参加しました`)
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
		noticeChannel.send({
			embeds: [embed]
		})
	})

	server.on('minecraft.player.died', (data: playerDeadEvent) => {
		if (!server.attributes.notice?.death) {
			return
		}
		const deathSadMessages = [
			'なんだとぉ',
			'なにぃ',
			'\\ (^o^) /',
			'死んだんじゃないの〜'
		]
		const deathSadMessage = deathSadMessages[Math.floor(Math.random() * deathSadMessages.length)]
		const embed = new EmbedBuilder()
		embed.setAuthor({
			name: server.name,
			iconURL: client.user?.displayAvatarURL()
		})
		embed.setTitle(translateFromDeathMessage(data.reason))
		embed.setDescription(`${data.reason}\n${deathSadMessage}`)
		embed.setColor(discordBotConfig.colors.death as ColorResolvable)
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
		embed.setDescription(`${translatedData.description}${data.advancement.type === 'CHALLENGE' ? '\nすごい！' : ''}`)
		embed.setColor(data.advancement.type === 'CHALLENGE' ? discordBotConfig.colors.challengeAdvancement : discordBotConfig.colors.normalAdvancement)
		noticeChannel.send({
			embeds: [embed]
		})
	})

	server.on('minecraft.player.chatted', async (data: playerChattedEvent) => {
		const diceCommandResult = diceCommandToMinimessage(data)
		if (diceCommandResult) {
			const { contentToSendMinecraft, contentToSendDiscord } = diceCommandResult
			server.proxy.sendChat(contentToSendMinecraft)
			noticeChannel.send(contentToSendDiscord)
			return
		}
		const { contentToSendMinecraft, contentToSendDiscord } = await japaneseNormalizer(data)
		server.proxy.sendChat(contentToSendMinecraft)
		noticeChannel.send(contentToSendDiscord)
	})

	server.on('minecraft.server.hanged', async (data: serverHangedEvent) => {
		if (!server.attributes.notice?.hang) {
			return
		}
		noticeChannel.send({
			content: `‼️ **${server.name}** は${time(new Date(data.lastTickTimestamp), TimestampStyles.RelativeTime)}から応答がありません!`
		})
		server.proxy.sendChat(`<red><bold>${server.name}</bold>は${Math.round((data.timestamp - data.lastTickTimestamp) / 1000)}秒以上応答がありません!`)
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
	const messageContents: Array<string> = []
	if (message.content !== '') {
		messageContents.push(minimessageNormalizer(message.content, message.guild))
	}
	if (message.attachments.size !== 0) {
		messageContents.push(`${message.attachments.map(attachment => `<click:open_url:${attachment.url}><underlined><aqua>${attachment.name}</aqua></underlined></click>`).join(', ')}がアップロードされました`)
	}
	if (message.stickers.size !== 0) {
		messageContents.push(`スタンプ(${[...message.stickers.values()][0].name})を送信しました`)
	}
	if (messageContents.length === 0) {
		return
	}
	const repliedMessage = message.reference?.messageId ? await message.channel.messages.fetch(message.reference?.messageId) : null
	const contentToSendMinecraft = `[<color:#5865F2>Discord</color> | ${discordUserNameNormalizer(message.member, message.author)}${repliedMessage ? `(${discordUserNameNormalizer(repliedMessage.member, repliedMessage.author)}に返信)` : ''}] <reset>${messageContents.join('\n')}`
	MinecraftServer.sendChatToAll(contentToSendMinecraft)
})
