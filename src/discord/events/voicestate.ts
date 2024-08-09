import { Events } from 'discord.js'
import { MinecraftServer } from '../../server/minecraft/main'
import { discordUserNameNormalizer } from '../../util/minimessage'
import { client } from '../index'

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
	//接続
	if (newState.channelId !== null && oldState.channelId === null) {
		MinecraftServer.sendChatToAll(`${discordUserNameNormalizer(newState.member)}が通話 #${newState.channel?.name ?? '不明'}に参加しました`)
		return
	}
	//切断
	if (newState.channelId === null && oldState.channelId !== null) {
		MinecraftServer.sendChatToAll(`${discordUserNameNormalizer(oldState.member)}が通話 #${oldState.channel?.name ?? '不明'}から切断しました`)
		return
	}
	//移動
	if (newState.channelId !== oldState.channelId) {
		MinecraftServer.sendChatToAll(`${discordUserNameNormalizer(newState.member)}が通話 #${oldState.channel?.name ?? '不明'}から通話 #${newState.channel?.name ?? '不明'}に移動しました`)
		return
	}
})
