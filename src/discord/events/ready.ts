import { Events } from 'discord.js'
import { client } from '..'
import { commandsData } from '../commands'

client.on(Events.ClientReady, () => {
	console.log(`${client?.user?.tag} logged in`)
	client.application?.commands.set(commandsData.map(commandData => commandData.data))

	import('../features/index')
})
