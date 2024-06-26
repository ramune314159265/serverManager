import express from 'express'

import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft/main'
import { MinecraftProxy } from '../../../server/minecraft/proxy'
import { serverRouter } from './server'

export const serversRouter = express.Router({ mergeParams: true })
serversRouter.use('/:serverId/', serverRouter)

serversRouter.get('/', (req, res) => {
	const sendData = []
	for (const server of Object.values(servers)) {
		switch (true) {
			case server instanceof MinecraftServer: {
				sendData.push({
					id: server.id,
					name: server.name,
					shortName: server.shortName,
					description: server.description,
					icon: server.icon,
					index: server.index,
					status: server.status,
					type: server.type,
					players: server.players.list,
					tps: server.tps,
					proxyId: server.proxy.id,
				})
				break
			}
			case server instanceof MinecraftProxy: {
				sendData.push({
					id: server.id,
					name: server.name,
					shortName: server.shortName,
					description: server.description,
					icon: server.icon,
					index: server.index,
					status: server.status,
					type: server.type,
					players: server.players.list,
					childIds: server.childServerIds,
				})
				break
			}
			default: {
				sendData.push({
					id: server.id,
					name: server.name,
					shortName: server.shortName,
					description: server.description,
					icon: server.icon,
					index: server.index,
					status: server.status,
					type: server.type,
				})
				break
			}
		}
	}

	res.send(sendData)
})
