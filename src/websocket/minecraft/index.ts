import { WebSocketServer } from 'ws'
import { servers } from '../../server'
import { MinecraftServer } from '../../server/minecraft'
import { serverConfig } from '../../config/server'

export const minecraftWsServer = new WebSocketServer({
	port: serverConfig.wsMcServerPort,
})

minecraftWsServer.on('connection', (wsConnection) => {
	wsConnection.on('error', console.error)
	wsConnection.on('message', message => {
		console.log(message.toString())
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case 'ws_connected':
				(servers[data.serverId] as MinecraftServer).setWsConnection(wsConnection)
				break
			case 'player_connected':
				{ (servers[data.joinedServerId] as MinecraftServer).players.connect(data.playerId) }
				{ (servers[data.proxyId] as MinecraftServer).players.connect(data.playerId) }
				break
			case 'player_moved':
				{ (servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId) }
				{ (servers[data.joinedServerId] as MinecraftServer).players.connect(data.playerId) }
				break
			case 'player_disconnected':
				(servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId)
				{ (servers[data.proxyId] as MinecraftServer).players.disconnect(data.playerId) }
				break
			default:
				break
		}

	})
})

minecraftWsServer.on('listening', () => {
	console.log('ws for minecraftServer listening')
})
