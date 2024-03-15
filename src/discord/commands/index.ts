import { ApplicationCommandDataResolvable, CommandInteraction } from 'discord.js'

export const commandsDataArray = [
	await import('./address/index'),
	await import('./list/index'),
	await import('./ping/index'),
	await import('./realoniserver/index'),
	await import('./start/index')
].map(i => i.default)

export const commandsData: { [key: string]: { data: ApplicationCommandDataResolvable, execute: (interaction: CommandInteraction) => void } } = {}
commandsDataArray.forEach(commandData => {
	commandsData[commandData.data.name] = commandData
})
