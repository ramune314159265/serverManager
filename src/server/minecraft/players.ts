export class Players {
	list: Array<string>
	constructor(playerList: Array<string> = []) {
		this.list = playerList
	}
	connect(playerId: string) {
		this.list.push(playerId)
	}
	disconnect(playerId: string) {
		this.list = this.list.filter(id => !(playerId === id))
	}
}
