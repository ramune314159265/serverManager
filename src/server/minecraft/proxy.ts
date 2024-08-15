import { MinecraftServerBase } from '.'
import { servers } from '..'
import { randomUUIDv4 } from '../../util/uuid'
import { minecraftProxyData, playerChattedEvent, playerConnectedEvent, playerDisconnectedEvent, playerMovedEvent } from '../interfaces'
import { MinecraftServer } from './main'

export class MinecraftProxy extends MinecraftServerBase {
	childServerIds: Array<string> = []
	constructor(serverData: minecraftProxyData, index: number) {
		super(serverData, index)
		this.childServerIds = serverData.childrenIds
	}
	sendChat(content: string) {
		if (!this.wsConnection) {
			throw new Error('server is offline')
		}
		const timestamp = Date.now()
		const uuid = randomUUIDv4()
		this.wsConnection.send(JSON.stringify({
			type: 'send_chat',
			content,
			timestamp,
			uuid
		}))
		setTimeout(() => {
			this.wsConnection?.send?.(JSON.stringify({
				type: 'send_chat',
				content,
				timestamp,
				uuid
			}))
		}, 3000)
	}
	minecraftDataReceived(message: string) {
		super.minecraftDataReceived(message)
		const data = JSON.parse(message)
		switch (data.type) {
			case 'player_connected':
				this.childServers[data.joinedServerId].emit('minecraft.player.connected', (data as playerConnectedEvent))
				break
			case 'player_moved':
				this.childServers[data.joinedServerId].emit('minecraft.player.moved', (data as playerMovedEvent))
				break
			case 'player_disconnected':
				this.childServers[data.previousJoinedServerId].emit('minecraft.player.disconnected', (data as playerDisconnectedEvent))
				break
			case 'player_chatted':
				this.childServers[data.serverId].emit('minecraft.player.chatted', (data as playerChattedEvent))
				break
		}
	}
	get childServers() {
		const childServers: { [key: string]: MinecraftServer } = {}
		this.childServerIds.forEach(id => childServers[id] = (servers[id] as MinecraftServer))
		return childServers
	}
}
