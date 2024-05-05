import express from 'express'

import { servers } from '../../../server'
import { WithServerIdParams } from './server'

export const consoleRouter = express.Router({ mergeParams: true })

const rootPath = '/' as const

consoleRouter.get<typeof rootPath, WithServerIdParams<typeof rootPath>>(rootPath, (req, res) => {
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
			content: 'server offline'
		})
	}
	res.status(200).send({
		id: server.id,
		col: server.consoleCol,
		row: server.consoleRow
	})
})

const historyPath = '/history' as const

consoleRouter.get<typeof historyPath, WithServerIdParams<typeof historyPath>>(historyPath, (req, res) => {
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
			content: 'server offline'
		})
	}
	res.status(200).send({
		id: server.id,
		content: server.consoleBuffer
	})
})
