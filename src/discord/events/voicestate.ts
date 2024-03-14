import { Events } from 'discord.js'
import { client } from '..'
import { minecraftWsServer } from '../../websocket/minecraft'

client.on(Events.VoiceStateUpdate, (oldState, newState) => {
	//接続
	if (newState.channelId !== null && oldState.channelId === null) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `<color:${newState.member?.displayHexColor ?? 'white'}><hover:show_text:'@${newState.member?.user.username ?? '不明'}'>${newState.member?.displayName ?? '不明'}</hover></color>が通話 #${newState.channel?.name ?? '不明'}に参加しました`
			}))
		})
		return
	}
	//切断
	if (newState.channelId === null && oldState.channelId !== null) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `<color:${oldState.member?.displayHexColor ?? 'white'}><hover:show_text:'@${oldState.member?.user.username ?? '不明'}'>${oldState.member?.displayName ?? '不明'}</hover></color>が通話 #${oldState.channel?.name ?? '不明'}から切断しました`
			}))
		})
		return
	}
	//移動
	if (newState.channelId !== oldState.channelId) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content: `<color:${newState.member?.displayHexColor ?? 'white'}><hover:show_text:'@${newState.member?.user.username ?? '不明'}'>${newState.member?.displayName ?? '不明'}</hover></color>が通話 #${oldState.channel?.name ?? '不明'}から通話 #${newState.channel?.name ?? '不明'}に移動しました`
			}))
		})
		return
	}
})
