import { ComponentEmojiResolvable } from 'discord.js'

export const statusEmojis: { [key: string]: ComponentEmojiResolvable } = {
	offline: '🔴',
	booting: '🟡',
	online: '🟢',
	unknown: '❓'
}
