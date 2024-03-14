export class Players {
	list: Array<string>
	constructor() {
		this.list = []
	}
	connect(playerId: string) {
		this.list.push(playerId)
	}
	disconnect(playerId: string) {
		this.list = this.list.filter(id => !(playerId === id))
	}
}
