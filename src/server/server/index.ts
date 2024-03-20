import EventEmitter2 from 'eventemitter2'
import { Machine } from '../../machine'
import { receivedData, serverAttributes, serverData } from '../interfaces'

export class Server extends EventEmitter2 {
	id: string
	name: string
	type: string
	attributes: serverAttributes
	machine: Machine
	status: string
	consoleBuffer: string
	constructor(serverData: serverData) {
		super()
		this.id = serverData.id
		this.name = serverData.name
		this.type = serverData.type
		this.attributes = serverData.attributes
		this.machine = Machine.list[serverData.machineId]
		this.status = 'offline'
		this.consoleBuffer = ''
	}
	dataReceived(data: receivedData) {
		switch (data.type) {
			case 'server_started':
				this.status = this.type === 'common' ? 'online' : 'booting'
				this.consoleBuffer = ''
				this.emit('processStart')
				break
			case 'server_stopped':
				this.status = 'offline'
				this.emit('processStop')
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
		if (this.status !== 'offline') {
			throw new Error('すでに起動ています')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_start',
			serverId: this.id
		}))
	}
	stop() {
		if (!this.status) {
			throw new Error('サーバーはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_stop',
			serverId: this.id
		}))
	}
	hardStop() {
		if (!this.status) {
			throw new Error('サーバーはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_hard_stop',
			serverId: this.id
		}))
	}
	writeConsole(content: string) {
		if (!this.status) {
			throw new Error('サーバーはオフラインです')
		}
		this.machine.connection?.send(JSON.stringify({
			type: 'server_write_stdin',
			serverId: this.id,
			content
		}))
	}
}
