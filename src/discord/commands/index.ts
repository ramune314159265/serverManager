export const commandsData = [
	await import('./start/index')
].map(i => i.default)
