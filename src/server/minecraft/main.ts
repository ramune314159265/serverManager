import { minecraftServerData, playerAdvancementDoneEvent, playerDeadEvent, serverHangedEvent, serverSentInfo } from '../interfaces'
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
	minecraftDataReceived(message: string) {
		super.minecraftDataReceived(message)
		const data = JSON.parse(message)
		switch (data.type) {
			case 'player_died':
				this.emit('minecraft.player.died', (data as playerDeadEvent))
				break
			case 'player_advancement_done':
				this.emit('minecraft.player.advancementDone', (data as playerAdvancementDoneEvent))
				break
			case 'every_second_info_send':
				this.emit('minecraft.server.info', (data as serverSentInfo))
				break
		}
	}
	get proxy() {
		return (servers[this.proxyId] as MinecraftProxy)
	}
}
