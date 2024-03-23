import { MinecraftServer } from './minecraft'
import { Server } from './server'
import { serverData } from './interfaces'

export const serverTypes: { [key: string]: new (serverData: serverData, index: number) => Server } = {
	'mc': MinecraftServer,
	'common': Server
}
