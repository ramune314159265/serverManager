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
		if (data.type !== 'ws_connected') {
			return
		}
		(servers[data.serverId] as MinecraftServer).setWsConnection(wsConnection)
	})
})

minecraftWsServer.on('listening', () => {
	console.log('ws for minecraftServer listening')
})
