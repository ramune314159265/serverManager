import { Events } from 'discord.js'
import { client } from '..'

client.on(Events.ClientReady, () => {
	console.log(`${client?.user?.tag} logged in`)

	import('../features/index')
})
