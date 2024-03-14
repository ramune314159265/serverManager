import { WebSocketServer } from 'ws'
import { servers } from '../../server'
import { MinecraftServer } from '../../server/minecraft'

export const minecraftWsServer = new WebSocketServer({
	port: 8001,
})

minecraftWsServer.on('connection', (wsConnection) => {
	wsConnection.on('error', console.error)
	wsConnection.on('message', message => {
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case 'player_connected':
				(servers[data.joinedServerId] as MinecraftServer).players.connect(data.playerId)
				break
			case 'player_moved':
				{ (servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId) }
				{ (servers[data.joinedServerId] as MinecraftServer).players.connect(data.playerId) }
				break
			case 'player_disconnected':
				(servers[data.previousJoinedServerId] as MinecraftServer).players.disconnect(data.playerId)
				break
			case 'server_started':
				(servers[data.serverId] as MinecraftServer).status = 'online'
				break
			case 'server_stopped':
				(servers[data.serverId] as MinecraftServer).status = 'booting'
				break

			default:
				break
		}
	})
})
