import express from 'express'
import { consoleRouter } from './console'
import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft'

export const serverRouter = express.Router()
serverRouter.use('/', consoleRouter)

serverRouter.get('/', (req, res) => {
	const sendData = []
	for (const server of Object.values(servers)) {
		switch (true) {
			case server instanceof MinecraftServer: {
				sendData.push({
					players: server.players.list,
					tps: server.tps,
					id: server.id,
					status: server.status
				})
				break
			}
			default: {
				sendData.push({
					id: server.id,
					status: server.status
				})
				break
			}
		}
	}

	res.send(JSON.stringify(sendData))
})

serverRouter.get('/:serverId/start', (req, res) => {
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
	if (server.status !== 'offline') {
		return res.status(400).send(JSON.stringify({
			content: 'already started'
		}))
	}
	server.start()
	res.status(200).send(JSON.stringify({
		id: server.id,
		content: 'started'
	}))
})

serverRouter.get('/:serverId/stop', (req, res) => {
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
	if (server.status === 'offline') {
		return res.status(400).send(JSON.stringify({
			content: 'server has stopped'
		}))
	}
	server.stop()
	res.status(200).send(JSON.stringify({
		id: server.id,
		content: 'stopped'
	}))
})

