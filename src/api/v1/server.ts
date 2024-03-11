import express from 'express'
import { Server } from '../../server/server'

export const serverRouter = express.Router()

serverRouter.get('/', (req, res) => {
	const servers = Server.list
	const sendData = []
	for (const server of Object.values(servers)) {
		sendData.push({
			id: server.id,
			online: server.isOnline
		})
	}

	res.send(JSON.stringify(sendData))
})

serverRouter.get('/:serverId/start', (req, res) => {
	if (!Object.hasOwn(Server.list, req.params.serverId)) {
		return res.status(404).send(JSON.stringify({
			content: 'not found'
		}))
	}
	const server = Server.list[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send(JSON.stringify({
			content: 'machine offline'
		}))
	}
	if (server.isOnline) {
		return res.status(400).send(JSON.stringify({
			content: 'already started'
		}))
	}
	server.start()
	res.status(200).send(JSON.stringify({
		id:server.id,
		content: 'started'
	}))
})

serverRouter.get('/:serverId/stop', (req, res) => {
	if (!Object.hasOwn(Server.list, req.params.serverId)) {
		return res.status(404).send(JSON.stringify({
			content: 'not found'
		}))
	}
	const server = Server.list[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send(JSON.stringify({
			content: 'machine offline'
		}))
	}
	if (!server.isOnline) {
		return res.status(400).send(JSON.stringify({
			content: 'server has stopped'
		}))
	}
	server.stop()
	res.status(200).send(JSON.stringify({
		id:server.id,
		content: 'stopped'
	}))
})

serverRouter.get('/:serverId/stop', (req, res) => {
	if (!Object.hasOwn(Server.list, req.params.serverId)) {
		return res.status(404).send(JSON.stringify({
			content: 'not found'
		}))
	}
	const server = Server.list[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send(JSON.stringify({
			content: 'machine offline'
		}))
	}
	if (!server.isOnline) {
		return res.status(400).send(JSON.stringify({
			content: 'server has stopped'
		}))
	}

	res.status(200).send(JSON.stringify({
		id:server.id,
		content: 'stopped'
	}))
})

