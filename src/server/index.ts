import throttledQueue from 'throttled-queue'

import { serverList } from '../config/serverlist'
import { Server } from './server'
import { serverData } from './interfaces'
import { getServerClass } from './servertypes'

export const servers: { [key: string]: Server } = {}
serverList.forEach((serverData: serverData, index: number) => {
	//@ts-expect-error 動くから
	servers[serverData.id] = new (getServerClass(serverData.type))(serverData, index)
})

export const autoStartQueue = throttledQueue(1, 5000)
