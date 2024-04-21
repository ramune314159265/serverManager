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

type minecraftServerBase = {
	type: 'mc',
	proxyId: string,
	minecraftItemIcon: string
}

type minecraftProxyBase = {
	type: 'mc_proxy',
	childrenIds: Array<string>
}

type commonServerBase = {
	type: 'common'
}

type serverDataBase = {
	name: string,
	id: string,
	description?: string,
	machineId: string,
	attributes: serverAttributes,
	autoStart: boolean,
}

export type minecraftServerData = serverDataBase & minecraftServerBase

export type minecraftProxyData = serverDataBase & minecraftProxyBase

export type commonServerData = serverDataBase & commonServerBase

export type serverData = serverDataBase & (commonServerBase | minecraftServerBase | minecraftProxyBase)

export interface receivedData {
	type: string,
	serverId?: string,
	content?: string,
	col?: number,
	row?: number
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
	key: string,
	namespace: string
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

export interface serverSentInfo {
	tps: number,
	lastTickTimestamp: number,
	timestamp: number
}
