import WebSocket from 'ws'

import { Server } from '../server'
import { serverData } from '../interfaces'
import { Players } from './players'
import { minecraftWsServer } from '../../websocket/minecraft'

export class MinecraftServerBase extends Server {
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
	constructor(serverData: serverData, index: number) {
		super(serverData, index)
		this.players = new Players()

		this.on('minecraft.started', () => this.status = 'online')
		this.on('minecraft.stopped', () => this.status = 'booting')
	}
	setWsConnection(connection: WebSocket) {
		this.wsConnection = connection
		connection.on('message', message => {
			this.minecraftDataReceived(message.toString())
		})
	}
	minecraftDataReceived(message: string) {
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case 'server_started':
				this.emit('minecraft.started')
				break
			case 'server_stopped':
				this.emit('minecraft.stopped')
				break
			default:
				break
		}
	}
}
