export interface serverData {
	id: string,
	type: string,
	machineId: string,
	attributes: object
}

export interface receivedData {
	type: string,
	serverId?: string,
	content?: string
}
