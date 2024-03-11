import { WebSocketServer } from 'ws'
import { Machine } from './machine'
import { app } from './api'

const wsServer = new WebSocketServer({
	port: 8000,
})

wsServer.on('connection', (wsConnection) => {
	wsConnection.on('error', console.error)

	wsConnection.on('message', (message) => {
		console.log(message)

		const data = JSON.parse(message.toString())
		if (data.type === 'machine_info_send') {
			Machine.list[data.machineId].setWsConnection(wsConnection)
		}
	})
})

app.listen(9000)
