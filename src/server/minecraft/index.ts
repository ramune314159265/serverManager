import WebSocket from 'ws'

import { Server } from '../server'
import { playerAdvancementDoneEvent, playerChattedEvent, playerConnectedEvent, playerDeadEvent, playerDisconnectedEvent, playerMovedEvent, serverData, serverHangedEvent } from '../interfaces'
import { Players } from './players'
import { minecraftWsServer } from '../../websocket/minecraft'

export class MinecraftServer extends Server {
	static sendChatToAll(content: string) {
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content
			}))
		})
	}
	players: Players
	wsConnection?: WebSocket
	lastHangedTickTimestamp: number
	tps: number
	constructor(serverData: serverData) {
		super(serverData)
		this.players = new Players()
		this.lastHangedTickTimestamp = Date.now()
		this.tps = 0
	}
	setWsConnection(connection: WebSocket) {
		this.wsConnection = connection

		connection.on('message', message => {
			const data = JSON.parse(message.toString())
			switch (data.type) {
				case 'server_started':
					this.status = 'online'
					this.emit('minecraft.started')
					break
				case 'server_stopped':
					this.status = 'booting'
					this.emit('minecraft.stopped')
					this.tps = 0
					break
				case 'player_connected':
					this.emit('minecraft.player.connected', (data as playerConnectedEvent))
					break
				case 'player_moved':
					this.emit('minecraft.player.moved', (data as playerMovedEvent))
					break
				case 'player_disconnected':
					this.emit('minecraft.player.disconnected', (data as playerDisconnectedEvent))
					break
				case 'player_died':
					this.emit('minecraft.player.died', (data as playerDeadEvent))
					break
				case 'player_advancement_done':
					this.emit('minecraft.player.advancementDone', (data as playerAdvancementDoneEvent))
					break
				case 'player_chatted':
					this.emit('minecraft.player.chatted', (data as playerChattedEvent))
					break
				case 'every_second_info_send':
					this.tps = Math.round(data.tps * 100) / 100
					if (data.timestamp - data.lastTickTimestamp <= 30 * 1000) {
						return
					}
					if (data.lastTickTimestamp === this.lastHangedTickTimestamp) {
						return
					}
					this.lastHangedTickTimestamp = data.lastTickTimestamp
					this.emit('minecraft.server.hanged', (data as serverHangedEvent))
					break
				default:
					break
			}
		})
	}
	sendChat(content: string) {
		if (!this.wsConnection) {
			throw new Error('server is offline')
		}
		this.wsConnection.send(JSON.stringify({
			type: 'send_chat',
			content
		}))
	}
}
