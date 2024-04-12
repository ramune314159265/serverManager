import WebSocket from 'ws'

import { Server } from '../server'
import { playerAdvancementDoneEvent, playerChattedEvent, playerConnectedEvent, playerDeadEvent, playerDisconnectedEvent, playerMovedEvent, serverData, serverSentInfo } from '../interfaces'
import { Players } from './players'
import { minecraftWsServer } from '../../websocket/minecraft'
import { servers } from '..'

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
			const data = JSON.parse(message.toString())
			switch (data.type) {
				case 'server_started':
					this.emit('minecraft.started')
					break
				case 'server_stopped':
					this.emit('minecraft.stopped')
					break
				case 'player_connected':
					servers[data.joinedServerId].emit('minecraft.player.connected', (data as playerConnectedEvent))
					break
				case 'player_moved':
					servers[data.joinedServerId].emit('minecraft.player.moved', (data as playerMovedEvent))
					break
				case 'player_disconnected':
					servers[data.previousJoinedServerId].emit('minecraft.player.disconnected', (data as playerDisconnectedEvent))
					break
				case 'player_died':
					this.emit('minecraft.player.died', (data as playerDeadEvent))
					break
				case 'player_advancement_done':
					this.emit('minecraft.player.advancementDone', (data as playerAdvancementDoneEvent))
					break
				case 'player_chatted':
					servers[data.serverId].emit('minecraft.player.chatted', (data as playerChattedEvent))
					break
				case 'every_second_info_send':
					this.emit('minecraft.server.info', (data as serverSentInfo))
					break
				default:
					break
			}
		})
	}
}
