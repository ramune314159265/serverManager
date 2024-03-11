import { machineList } from '../config/machinelist'
import { machineData } from './interfaces'
import WebSocket from 'ws'

export class Machine {
	static list: { [key: string]: Machine } = {}
	static {
		machineList.forEach((machineData: machineData) => {
			Machine.list[machineData.id] = new Machine(machineData)
		})
	}

	id: string
	connection: WebSocket | null
	constructor(machineData: machineData) {
		this.id = machineData.id
		this.connection = null
	}
	get isOnline() {
		return this.connection === null ? false : true
	}
	setWsConnection(connection: WebSocket) {
		this.connection = connection

		connection.on('message', async message => {
			const data = JSON.parse(message.toString())
			if (!data.serverId) {
				return
			}
			const Server = await (await import('../server/server')).Server
			Server.list[data.serverId].dataReceived(data)
		})
	}
}
