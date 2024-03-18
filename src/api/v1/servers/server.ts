import express from 'express'
import { RouteParameters } from 'express-serve-static-core'
import { servers } from '../../../server'
import { consoleRouter } from './console'

//https://stackoverflow.com/questions/72395842/using-express-mergeparams-with-typescript
export type WithServerIdParams<T extends string> = RouteParameters<':serverId'> & RouteParameters<T>

export const serverRouter = express.Router({ mergeParams: true })
serverRouter.use('/console', consoleRouter)

const startPath = '/start' as const

serverRouter.get<typeof startPath, WithServerIdParams<typeof startPath>>(startPath, (req, res) => {
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

const stopPath = '/stop' as const

serverRouter.get<typeof stopPath, WithServerIdParams<typeof stopPath>>(stopPath, (req, res) => {
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
	const isHard = Object.hasOwn(req.params, 'hard')
	isHard ? server.hardStop() : server.stop()
	res.status(200).send(JSON.stringify({
		isHard,
		id: server.id,
		content: 'stopped'
	}))
})
