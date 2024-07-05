import { WebSocketServer } from 'ws'

import { serverConfig } from '../../config/server'
import { servers } from '../../server'
import { MinecraftServerBase } from '../../server/minecraft/index'
import { MinecraftServer } from '../../server/minecraft/main'
import { MinecraftProxy } from '../../server/minecraft/proxy'

const receivedTimestamps = new Set<number>()

export const minecraftWsServer = new WebSocketServer({
	port: serverConfig.wsMcServerPort,
})

minecraftWsServer.on('connection', (wsConnection) => {
	wsConnection.on('error', console.error)
	wsConnection.on('message', message => {
		console.log(message.toString())
		const data = JSON.parse(message.toString())

		if (receivedTimestamps.has(data?.timestamp)) {
			return
		}
		switch (data.type) {
			case 'ws_connected':
				(servers[data.serverId] as MinecraftServerBase).setWsConnection(wsConnection)
				break
			case 'player_connected':
				{ (servers[data.joinedServerId] as MinecraftServer).players.connect(data.playerId) }
				{ (servers[data.proxyId] as MinecraftProxy).players.connect(data.playerId) }
				break
			case 'player_moved':
				{ (servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId) }
				{ (servers[data.joinedServerId] as MinecraftServerBase).players.connect(data.playerId) }
				break
			case 'player_disconnected':
				(servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId)
				{ (servers[data.proxyId] as MinecraftProxy).players.disconnect(data.playerId) }
				break
			default:
				break
		}

		if (data.timestamp) {
			receivedTimestamps.add(data.timestamp)
		}
	})
})

minecraftWsServer.on('listening', () => {
	console.log('ws for minecraftServer listening')
})
