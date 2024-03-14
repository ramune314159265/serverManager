import { WebSocketServer } from 'ws'

export const minecraftWsServer = new WebSocketServer({
	port: 8080,
})

minecraftWsServer.on('connection', (wsConnection) => {

})
