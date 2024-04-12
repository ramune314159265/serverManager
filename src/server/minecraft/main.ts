import { minecraftServerData, serverHangedEvent, serverSentInfo } from '../interfaces'
import { MinecraftServerBase } from '.'
import { MinecraftProxy } from './proxy'
import { servers } from '..'

export class MinecraftServer extends MinecraftServerBase {
	lastHangedTickTimestamp: number
	tps: number
	proxyId: string
	constructor(serverData: minecraftServerData, index: number) {
		super(serverData, index)
		this.lastHangedTickTimestamp = Date.now()
		this.tps = 0
		this.proxyId = serverData.proxyId

		this.on('minecraft.stopped', () => {
			this.tps = 0
		})
		this.on('minecraft.server.info', (data: serverSentInfo) => {
			this.tps = Math.round(data.tps * 100) / 100
			if (data.timestamp - data.lastTickTimestamp <= 30 * 1000) {
				return
			}
			if (data.lastTickTimestamp === this.lastHangedTickTimestamp) {
				return
			}
			this.lastHangedTickTimestamp = data.lastTickTimestamp
			this.emit('minecraft.server.hanged', (data as serverHangedEvent))
		})
	}
	get proxy() {
		return (servers[this.proxyId] as MinecraftProxy)
	}
}
