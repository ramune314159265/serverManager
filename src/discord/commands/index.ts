import { ApplicationCommandDataResolvable, CommandInteraction } from 'discord.js'

export const commandsDataArray = [
	await import('./start/index')
].map(i => i.default)

export const commandsData: { [key: string]: { data: ApplicationCommandDataResolvable, execute: (interaction: CommandInteraction) => void } } = {}
commandsDataArray.forEach(commandData => {
	commandsData[commandData.data.name] = commandData
})
