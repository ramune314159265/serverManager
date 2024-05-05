import { servers } from '../../../server'
import { Server } from '../../../server/server'
import { v2Router } from '../index'

const wsPath = '/ws/'
const sendEvents: Array<string> = [
	'process.start',
	'process.stop',
	'minecraft.started',
	'minecraft.stopped',
	'minecraft.player.connected',
	'minecraft.player.moved',
	'minecraft.player.disconnected'
]

v2Router.ws(wsPath, (ws) => {
	const listeners: { [key: string]: (eventName: (string | string[]), ...data: Array<object>) => void } = {}
	const listener = (server: Server) => (eventName: (string | string[]), ...data: Array<object>) => {
		if (!sendEvents.includes(eventName as unknown as string)) {
			return
		}

		ws.send(JSON.stringify({
			type: eventName,
			serverId: server.id,
			...data
		}))
	}
	for (const server of Object.values(servers)) {
		listeners[server.id] = listener(server)
		server.onAny(listeners[server.id])
	}
	ws.on('close', () => {
		for (const server of Object.values(servers)) {
			server.offAny(listeners[server.id])
		}
	})
})
