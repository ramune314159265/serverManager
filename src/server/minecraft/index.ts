import WebSocket from 'ws'

import { randomUUIDv4 } from '../../util/uuid'
import { minecraftWsServer } from '../../websocket/minecraft'
import { serverData } from '../interfaces'
import { Server } from '../server'
import { Players } from './players'

const receivedUuid = new Set<string>()

export class MinecraftServerBase extends Server {
	static sendChatToAll(content: string) {
		const timestamp = Date.now()
		const uuid = randomUUIDv4()
		minecraftWsServer.clients.forEach(wsConnection => {
			wsConnection.send(JSON.stringify({
				type: 'send_chat',
				content,
				timestamp,
				uuid
			}))
		})
		setTimeout(() => {
			minecraftWsServer.clients.forEach(wsConnection => {
				wsConnection.send(JSON.stringify({
					type: 'send_chat',
					content,
					timestamp,
					uuid
				}))
			})
		}, 3000)
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
			const data = JSON.parse(message.toString())
			if (receivedUuid.has(data?.uuid)) {
				return
			}
			this.minecraftDataReceived(message.toString())

			if (data.uuid) {
				receivedUuid.add(data.uuid)
			}
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
