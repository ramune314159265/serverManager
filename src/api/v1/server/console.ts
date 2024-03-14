import express from 'express'
import { servers } from '../../../server'

export const consoleRouter = express.Router()

consoleRouter.get('/:serverId/console/history/', (req, res) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		return res.status(404).send(JSON.stringify({
			content: 'not found'
		}))
	}
	const server = servers[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send(JSON.stringify({
			content: 'machine offline'
		}))
	}
	if (!server.isOnline) {
		return res.status(400).send(JSON.stringify({
			content: 'server offline'
		}))
	}
	res.status(200).send(JSON.stringify({
		id: server.id,
		content: server.consoleBuffer
	}))
})

consoleRouter.ws('/:serverId/console/ws/', (ws, req) => {
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
	if (!server.isOnline) {
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
	ws.on('close', () => {
		server.removeListener('stdout', stdoutHandle)
	})
})
