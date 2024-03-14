import { serverList } from '../config/serverlist'
import { Server } from './server'
import { serverData } from './interfaces'
import { serverTypes } from './servertypes'

export const servers: { [key: string]: Server } = {}
serverList.forEach((serverData: serverData) => {
	servers[serverData.id] = new serverTypes[serverData.type](serverData)
})
