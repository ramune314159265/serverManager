import throttledQueue from 'throttled-queue'

import { serverList } from '../config/serverlist'
import { Server } from './server'
import { serverData } from './interfaces'
import { serverTypes } from './servertypes'

export const servers: { [key: string]: Server } = {}
serverList.forEach((serverData: serverData, index: number) => {
	servers[serverData.id] = new serverTypes[serverData.type](serverData, index)
})

export const autoStartQueue = throttledQueue(1, 5000)
