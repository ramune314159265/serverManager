import express from 'express'

import { servers } from '../../../server'
import { MinecraftServer } from '../../../server/minecraft/main'
import { serverRouter } from './server'
import { MinecraftProxy } from '../../../server/minecraft/proxy'

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
					index: server.index,
					status: server.status,
					type: server.type,
					players: server.players.list,
					childIds: server.childServers.map(s => s.id),
				})
				break
			}
			default: {
				sendData.push({
					id: server.id,
					name: server.name,
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
