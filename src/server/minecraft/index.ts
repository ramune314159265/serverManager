import WebSocket from 'ws'

import { Server } from '../server'
import { playerAdvancementDoneEvent, playerChattedEvent, playerConnectedEvent, playerDeadEvent, playerDisconnectedEvent, playerMovedEvent, serverData } from '../interfaces'
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
	constructor(serverData: serverData) {
		super(serverData)
		this.players = new Players()
	}
	setWsConnection(connection: WebSocket) {
		this.wsConnection = connection

		connection.on('message', message => {
			const data = JSON.parse(message.toString())
			switch (data.type) {
				case 'server_started':
					this.status = 'online'
					this.emit('minecraftStarted')
					break
				case 'server_stopped':
					this.status = 'booting'
					this.emit('minecraftStopped')
					break
				case 'player_connected':
					this.emit('minecraftPlayerConnected', (data as playerConnectedEvent))
					break
				case 'player_moved':
					this.emit('minecraftPlayerMoved', (data as playerMovedEvent))
					break
				case 'player_disconnected':
					this.emit('minecraftPlayerDisconnected', (data as playerDisconnectedEvent))
					break
				case 'player_died':
					this.emit('minecraftPlayerDied', (data as playerDeadEvent))
					break
				case 'player_advancement_done':
					this.emit('minecraftPlayerAdvancementDone', (data as playerAdvancementDoneEvent))
					break
				case 'player_chatted':
					this.emit('minecraftPlayerChatted', (data as playerChattedEvent))
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
