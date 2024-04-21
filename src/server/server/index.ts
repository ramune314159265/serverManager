import EventEmitter2 from 'eventemitter2'

import { Machine } from '../../machine'
import { receivedData, serverAttributes, serverData } from '../interfaces'

export class Server extends EventEmitter2 {
	id: string
	name: string
	index: number
	description: string
	type: string
	attributes: serverAttributes
	machine: Machine
	status: string
	consoleBuffer: string
	autoStart: boolean
	consoleCol: number
	consoleRow: number
	constructor(serverData: serverData, index: number) {
		super({
			wildcard: true,
			delimiter: '.',
			maxListeners: 20,
		})
		this.id = serverData.id
		this.name = serverData.name
		this.index = index
		this.description = serverData.description ?? ''
		this.type = serverData.type
		this.attributes = serverData.attributes
		this.machine = Machine.list[serverData.machineId]
		this.status = 'offline'
		this.consoleBuffer = ''
		this.consoleCol = 0
		this.consoleRow = 0
		this.autoStart = serverData.autoStart
	}
	dataReceived(data: receivedData) {
		switch (data.type) {
			case 'server_started':
				this.status = this.type === 'common' ? 'online' : 'booting'
				this.consoleBuffer = ''
				this.emit('process.start')
				break
			case 'resize':
				if (!((typeof data.col === 'number') && (typeof data.row === 'number'))) {
					return
				}
				this.consoleCol = data.col
				this.consoleRow = data.row
				this.emit('process.resize', { col: data.col, row: data.row })
				break
			case 'server_stopped':
				this.status = 'offline'
				this.emit('process.stop')
				break
			case 'server_stdout':
				if (!(typeof data.content === 'string')) {
					return
				}
				this.consoleBuffer += data.content
				this.emit('process.stdout', data.content)
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
