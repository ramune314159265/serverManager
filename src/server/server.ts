import { serverList } from '../config/serverlist'
import { Machine } from '../machine'
import { receivedData, serverData } from './interfaces'

export class Server {
	static list: { [key: string]: Server } = {}
	static {
		serverList.forEach((serverData: serverData) => {
			Server.list[serverData.id] = new Server(serverData)
		})
	}

	id: string
	attributes: object
	machine: Machine
	isOnline: boolean
	consoleBuffer: string
	constructor(serverData: serverData) {
		this.id = serverData.id
		this.attributes = serverData.attributes
		this.machine = Machine.list[serverData.machineId]
		this.isOnline = false
		this.consoleBuffer = ''
	}
	dataReceived(data: receivedData) {
		switch (data.type) {
			case 'server_started':
				this.isOnline = true
				break
			case 'server_stopped':
				this.isOnline = false
				break
			case 'server_stdout':
				this.consoleBuffer += data.content
				break

			default:
				break
		}
	}
	start() {
		if (!this.machine.isOnline) {
			throw new Error('マシンはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_start',
			serverId: this.id
		}))
	}
	stop() {
		if (!this.machine.isOnline) {
			throw new Error('マシンはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_stop',
			serverId: this.id
		}))
	}
}
