import { Server } from '../server'
import { serverData } from '../interfaces'
import { Players } from './players'

export class MinecraftServer extends Server {
	players: Players
	constructor(serverData: serverData) {
		super(serverData)
		this.players = new Players()
	}
}
