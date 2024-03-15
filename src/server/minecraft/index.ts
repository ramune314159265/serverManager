import WebSocket from 'ws'

import { Server } from '../server'
import { serverData } from '../interfaces'
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
	}
}
