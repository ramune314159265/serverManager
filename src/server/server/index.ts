import EventEmitter from 'node:events'
import { Machine } from '../../machine'
import { receivedData, serverData } from '../interfaces'

export class Server extends EventEmitter {	id: string
	attributes: object
	machine: Machine
	isOnline: boolean
	consoleBuffer: string
	constructor(serverData: serverData) {
		super()
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
				this.emit('start')
				break
			case 'server_stopped':
				this.isOnline = false
				this.emit('stop')
				break
			case 'server_stdout':
				if (!(typeof data.content === 'string')) {
					return
				}
				this.consoleBuffer += data.content
				this.emit('stdout', data.content)
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
		if (!this.isOnline) {
			throw new Error('サーバーはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_stop',
			serverId: this.id
		}))
	}
	writeConsole(content: string) {
		if (!this.isOnline) {
			throw new Error('サーバーはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_write_stdin',
			content
		}))
	}
}
