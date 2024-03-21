export interface serverAttributes {
	isStartableFromDiscord: boolean,
	startMention?: boolean,
	notice?: {
		start: boolean,
		stop: boolean,
		hang: boolean,
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

export interface playerConnectedEvent {
	playerId: string,
	joinedServerId: string,
	proxyId: string,
	timestamp: number
}

export interface playerMovedEvent {
	playerId: string,
	joinedServerId: string,
	previousJoinedServerId: string,
	proxyId: string,
	timestamp: number
}

export interface playerDisconnectedEvent {
	playerId: string,
	previousJoinedServerId: string,
	proxyId: string,
	timestamp: number
}

export interface playerDeadEvent {
	reason: string,
	playerId: string,
	timestamp: number
}

export interface advancementData {
	type: string,
	description: string,
	name: string,
	key: string
}

export interface playerAdvancementDoneEvent {
	playerId: string,
	advancement: advancementData,
	timestamp: number
}

export interface playerChattedEvent {
	playerId: string,
	proxyId: string,
	serverId: string,
	content: string,
	timestamp: number
}

export interface serverHangedEvent {
	tps: number,
	lastTickTimestamp: number,
	timestamp: number
}
