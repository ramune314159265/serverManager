import { Events } from 'discord.js'

import { client } from '../index'
import { minecraftWsServer } from '../../websocket/minecraft'
import { discordUserNameNormalizer } from '../../util/minimessage'

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
	//接続
	if (newState.channelId !== null && oldState.channelId === null) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `${discordUserNameNormalizer(newState.member)}が通話 #${newState.channel?.name ?? '不明'}に参加しました`
			}))
		})
		return
	}
	//切断
	if (newState.channelId === null && oldState.channelId !== null) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `${discordUserNameNormalizer(oldState.member)}が通話 #${oldState.channel?.name ?? '不明'}から切断しました`
			}))
		})
		return
	}
	//移動
	if (newState.channelId !== oldState.channelId) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `${discordUserNameNormalizer(newState.member)}が通話 #${oldState.channel?.name ?? '不明'}から通話 #${newState.channel?.name ?? '不明'}に移動しました`
			}))
		})
		return
	}
})
