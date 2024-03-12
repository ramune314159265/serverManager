import { WebSocketServer } from 'ws'
import { Machine } from '../../machine'

export const childWsServer = new WebSocketServer({
	port: 8000,
})

childWsServer.on('connection', (wsConnection) => {
	wsConnection.on('error', console.error)

	wsConnection.on('message', (message) => {
		console.log(message.toString())

		const data = JSON.parse(message.toString())
		if (data.type === 'machine_info_send') {
			Machine.list[data.machineId].setWsConnection(wsConnection)
		}
	})
})
