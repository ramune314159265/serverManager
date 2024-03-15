export interface serverAttributes {
	isStartableFromDiscord: boolean,
	startMention?: boolean,
	notice?: {
		start: boolean,
		stop: boolean,
		joinLeave: boolean,
		advancement: boolean,
		death: boolean
	}
}

export interface serverData {
	name: string,
	id: string,
	type: string,
	machineId: string,
	attributes: serverAttributes
}

export interface receivedData {
	type: string,
	serverId?: string,
	content?: string
}

export interface playerDeadEvent {
	reason: string,
	playerId: string,
}

export interface playerAdvancementDoneEvent {
	playerId: string,
	advancement: {
		type: string,
		description: string,
		name: string
	}
}

export interface playerChattedEvent {
	playerId: string
	proxyId: string,
	serverId: string,
	content: string
}
