import { serverList } from '../config/serverlist';
import { Machine } from '../machine';
import { serverData } from './interfaces';

class Server {
	static {
		serverList.forEach((serverData: serverData) => {
			Server.list[serverData.id] = new Server(serverData)
		})
	}
	static list: { [key: string]: Server } = {}

	id: string
	attributes: object
	machine: Machine
	constructor(serverData: serverData) {
		this.id = serverData.id
		this.attributes = serverData.attributes
		this.machine = Machine.list[serverData.machineId]
	}
}
