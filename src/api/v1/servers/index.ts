import express from 'express'
import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft'
import { serverRouter } from './server'

export const serversRouter = express.Router({ mergeParams: true })
serversRouter.use('/:serverId/', serverRouter)

serversRouter.get('/', (req, res) => {
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
					status: server.status,
					type: server.type,
					attributes: server.attributes
				})
				break
			}
		}
	}

	res.send(JSON.stringify(sendData))
})
