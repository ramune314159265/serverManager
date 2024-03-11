import { serverList } from '../config/serverlist'
import { Machine } from '../machine'
import { serverData } from './interfaces'

export class Server {
	static {
		serverList.forEach((serverData: serverData) => {
			Server.list[serverData.id] = new Server(serverData)
		})
	}
	static list: { [key: string]: Server } = {}

	id: string
	attributes: object
	machine: Machine
	isOnline:boolean
	constructor(serverData: serverData) {
		this.id = serverData.id
		this.attributes = serverData.attributes
		this.machine = Machine.list[serverData.machineId]
		this.isOnline = false
	}
	dataReceived(data){

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
	stop(){
		if (!this.machine.isOnline) {
			throw new Error('マシンはオフラインです')
		}
	}
}
