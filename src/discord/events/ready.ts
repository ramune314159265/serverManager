import { Events } from 'discord.js'

import { client } from '../index'
import { commandsDataArray } from '../commands'

client.on(Events.ClientReady, () => {
	console.log(`${client?.user?.tag} logged in`)
	client.application?.commands.set(commandsDataArray.map(commandData => commandData.data))

	import('../features/index')
})
