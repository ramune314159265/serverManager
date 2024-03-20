import { servers } from '../../../server'
import { serversRouter } from '../servers'

serversRouter.ws('/:serverId/console/ws/', (ws, req) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		ws.send(JSON.stringify({
			content: 'not found'
		}))
		return ws.close()
	}
	const server = servers[req.params.serverId]
	if (!server.machine.isOnline) {
		ws.send(JSON.stringify({
			content: 'machine offline'
		}))
		return ws.close()
	}
	if (server.status === 'offline') {
		ws.send(JSON.stringify({
			content: 'server offline'
		}))
		return ws.close()
	}

	const stdoutHandle = (data: string) => {
		ws.send(JSON.stringify({
			type: 'stdout',
			content: data
		}))
	}
	server.on('stdout', stdoutHandle)
	ws.on('message', message => {
		const data = JSON.parse(message.toString())
		switch (data.type) {
			case 'write_stdin': {
				if (typeof data.content !== 'string') {
					return
				}
				console.log(data.content)
				server.writeConsole(data.content)
			}
		}
	})
	ws.on('close', () => {
		server.removeListener('stdout', stdoutHandle)
	})
})
