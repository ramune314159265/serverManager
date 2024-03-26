import { servers } from '../../../server'
import { serversRouter } from '../servers'

serversRouter.ws('/:serverId/console/ws/', (ws, req) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		ws.close(1000, 'not found')
		return
	}
	const server = servers[req.params.serverId]
	if (!server.machine.isOnline) {
		ws.close(1000, 'machine offline')
		return
	}
	if (server.status === 'offline') {
		ws.close(1000, 'server offline')
		return
	}

	const stdoutHandle = (data: string) => {
		ws.send(JSON.stringify({
			type: 'stdout',
			content: data
		}))
	}
	const stopHandle = () => {
		ws.close(1000, 'server stopped')
	}
	server.on('process.stdout', stdoutHandle)
	server.on('process.stop', stopHandle)
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
		server.removeListener('process.stdout', stdoutHandle)
		server.removeListener('process.stop', stopHandle)
	})
})
