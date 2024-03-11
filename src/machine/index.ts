import { machineList } from '../config/machinelist'
import { Server } from '../server/server'
import { machineData } from './interfaces'
import WebSocket from 'ws'

export class Machine {
	static {
		machineList.forEach((machineData: machineData) => {
			Machine.list[machineData.id] = new Machine(machineData)
		})
	}
	static list: { [key: string]: Machine } = {}

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

		connection.on('message', message => {
			const data = JSON.parse(message.toString())
			if(!data.serverId){
				return
			}
			Server.list[data.serverId].dataReceived(data)
		})
	}
}
