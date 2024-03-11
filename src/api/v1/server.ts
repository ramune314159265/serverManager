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
