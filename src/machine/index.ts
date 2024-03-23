import WebSocket from 'ws'

import { machineList } from '../config/machinelist'
import { autoStartQueue, servers } from '../server'
import { machineData } from './interfaces'

export class Machine {
	static list: { [key: string]: Machine } = {}
	static {
		machineList.forEach((machineData: machineData) => {
			Machine.list[machineData.id] = new Machine(machineData)
		})
	}

	id: string
	name: string
	connection: WebSocket | null
	constructor(machineData: machineData) {
		this.id = machineData.id
		this.name = machineData.name
		this.connection = null
	}
	get isOnline() {
		return this.connection === null ? false : true
	}
	setWsConnection(connection: WebSocket) {
		this.connection = connection

		connection.on('message', async message => {
			const data = JSON.parse(message.toString())
			switch (data.type) {
				case 'machine_started':
					for (const server of Object.values(servers)) {
						if (!server.autoStart) {
							continue
						}
						if (!(server.machine.id === this.id)) {
							continue
						}
						autoStartQueue(() => {
							server.start()
						})
					}
					break
				default:
					if (!data.serverId) {
						return
					}
					servers[data.serverId].dataReceived(data)
					break
			}
		})

		connection.on('close', () => {
			this.connection = null
		})
	}
}
