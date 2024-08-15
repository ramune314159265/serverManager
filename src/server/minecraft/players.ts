export class Players {
	#list: Set<string>
	get list(){
		return [...this.#list]
	}
	constructor(playerList: Array<string> = []) {
		this.#list = new Set()
		playerList.forEach(player => this.#list.add(player))
	}
	connect(playerId: string) {
		this.#list.add(playerId)
	}
	disconnect(playerId: string) {
		this.#list.delete(playerId)
	}
}
