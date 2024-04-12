import { MinecraftServer } from './minecraft/main'
import { Server } from './server'
import { MinecraftProxy } from './minecraft/proxy'

export const serverTypes = {
	'mc': MinecraftServer,
	'mc_proxy': MinecraftProxy,
	'common': Server
} as const

export const getServerClass = (type: keyof typeof serverTypes) => {
	return serverTypes[type]
}
