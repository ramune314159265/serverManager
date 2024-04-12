import express from 'express'
import { RouteParameters } from 'express-serve-static-core'

import { servers } from '../../../server'
import { consoleRouter } from './console'
import { MinecraftServer } from '../../../server/minecraft/main'
import { MinecraftProxy } from '../../../server/minecraft/proxy'

//https://stackoverflow.com/questions/72395842/using-express-mergeparams-with-typescript
export type WithServerIdParams<T extends string> = RouteParameters<':serverId'> & RouteParameters<T>

export const serverRouter = express.Router({ mergeParams: true })
serverRouter.use('/console', consoleRouter)

const rootPath = '/' as const

serverRouter.get<typeof rootPath, WithServerIdParams<typeof rootPath>>(rootPath, (req, res) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		return res.status(404).send({
			content: 'not found'
		})
	}
	const server = servers[req.params.serverId]
	switch (true) {
		case server instanceof MinecraftServer: {
			res.status(200).send({
				id: server.id,
				name: server.name,
				index: server.index,
				status: server.status,
				type: server.type,
				attributes: server.attributes,
				players: server.players.list,
				proxyId: server.proxy.id,
				tps: server.tps,
			})
			break
		}
		case server instanceof MinecraftProxy: {
			res.status(200).send({
				id: server.id,
				name: server.name,
				index: server.index,
				status: server.status,
				type: server.type,
				attributes: server.attributes,
				players: server.players.list,
				childIds: server.childServers.map(s => s.id),
			})
			break
		}
		default: {
			res.status(200).send({
				id: server.id,
				name: server.name,
				index: server.index,
				status: server.status,
				type: server.type,
				attributes: server.attributes,
			})
			break
		}
	}
})

const startPath = '/start' as const

serverRouter.get<typeof startPath, WithServerIdParams<typeof startPath>>(startPath, (req, res) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		return res.status(404).send({
			content: 'not found'
		})
	}
	const server = servers[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send({
			content: 'machine offline'
		})
	}
	if (server.status !== 'offline') {
		return res.status(400).send({
			content: 'already started'
		})
	}
	server.start()
	res.status(200).send({
		id: server.id,
		content: 'started'
	})
})

const stopPath = '/stop' as const

serverRouter.get<typeof stopPath, WithServerIdParams<typeof stopPath>>(stopPath, (req, res) => {
	if (!Object.hasOwn(servers, req.params.serverId)) {
		return res.status(404).send({
			content: 'not found'
		})
	}
	const server = servers[req.params.serverId]
	if (!server.machine.isOnline) {
		return res.status(500).send({
			content: 'machine offline'
		})
	}
	if (server.status === 'offline') {
		return res.status(400).send({
			content: 'server has stopped'
		})
	}
	const isHard = Object.hasOwn(req.query, 'hard')
	isHard ? server.hardStop() : server.stop()
	res.status(200).send({
		isHard,
		id: server.id,
		content: 'stopped'
	})
})
