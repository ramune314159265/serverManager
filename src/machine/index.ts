import WebSocket from 'ws'

import { machineList } from '../config/machinelist'
import { servers } from '../server'
import { machineData } from './interfaces'

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
			servers[data.serverId].dataReceived(data)
		})

		connection.on('close', () => {
			this.connection = null
		})
	}
}
