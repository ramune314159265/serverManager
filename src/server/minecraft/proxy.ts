import { minecraftProxyData } from '../interfaces'
import { MinecraftServerBase } from '.'
import { servers } from '..'
import { MinecraftServer } from './main'

export class MinecraftProxy extends MinecraftServerBase {
	childServerIds: Array<string> = []
	constructor(serverData: minecraftProxyData, index: number) {
		super(serverData, index)
		this.childServerIds = serverData.childrenIds
	}
	sendChat(content: string) {
		if (!this.wsConnection) {
			throw new Error('server is offline')
		}
		this.wsConnection.send(JSON.stringify({
			type: 'send_chat',
			content
		}))
	}
	get childServers() {
		return (this.childServerIds.map(id => servers[id]) as Array<MinecraftServer>)
	}
}
