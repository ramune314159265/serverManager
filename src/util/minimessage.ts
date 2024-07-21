import { Guild, GuildMember, User } from 'discord.js'
import { servers } from '../server'
import { playerChattedEvent } from '../server/interfaces'
import { evalDiceCommand, isDiceCommand } from './dice'

export const markdownToMinimessage = (content: string): string => {
	return content
		.replace(/\*\*(.+?)\*\*/g, "<bold>$1</bold>")
		.replace(/\*(.+?)\*/g, "<italic>$1</italic>")
		.replace(/__(.+?)__/g, "<underlined>$1</underlined>")
		.replace(/~~(.+?)~~/g, "<strikethrough>$1</strikethrough>")
		.replace(/`(.+?)`/g, "<font:uniform>$1</font>")
		.replace(/\|\|(.+?)\|\|/g, "<gray><hover:show_text:'$1'>[隠されたメッセージ]</hover></gray>")
}

export const URLToMinimessage = (content: string): string => {
	return content
		.replace(/(https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig, (match: string, p1: string) => {
			return `<click:open_url:'${p1}'><underlined><aqua>${decodeURIComponent(p1)}</aqua></underlined></click>`
		})
}

export const mentionsToMinimessage = (content: string, guild: (Guild | null)): string => {
	return content
		.replaceAll('<id:home>', '<aqua>サーバーガイド</aqua>')
		.replaceAll('<id:customize>', '<aqua>チャンネル&ロール</aqua>')
		.replaceAll('<id:browse>', '<aqua>チャンネル一覧</aqua>')
		.replaceAll('@everyone', '<aqua>@everyone</aqua>')
		.replaceAll('@here', '<aqua>@here</aqua>')
		.replace(/<\/(.+?):(\d{5,20})>/g, `<aqua>/$1</aqua>`)
		.replace(/<@(\d{5,20})>/g, (match: string, p1: string) => {
			return `<color:${guild?.members?.cache?.get?.(p1)?.displayHexColor ?? 'aqua'}>@${guild?.members?.cache?.get?.(p1)?.displayName ?? '不明なユーザー'}</color>`
		})
		.replace(/<@&(\d{5,20})>/g, (match: string, p1: string) => {
			const rawHexColor = guild?.roles?.cache?.get?.(p1)?.hexColor
			const color = (rawHexColor === '#000000') ? null : rawHexColor
			return `<color:${color ?? 'aqua'}>@${guild?.roles?.cache?.get?.(p1)?.name ?? '不明なロール'}</color>`
		})
		.replace(/<#(\d{5,20})>/g, (match: string, p1: string) => {
			return `<aqua>#${guild?.channels?.cache?.get?.(p1)?.name ?? '不明なチャンネル'}</aqua>`
		})
}

export const minimessageNormalizer = (content: string, guild: (Guild | null)): string => {
	return markdownToMinimessage(mentionsToMinimessage(URLToMinimessage(content), guild))
}

export const discordUserNameNormalizer = (member: (GuildMember | null), user?: (User | null)): string => {
	return `<color:${member?.displayHexColor ?? 'white'}><hover:show_text:'@${member?.user?.username ?? user?.displayName ?? '不明'}'>${member?.displayName ?? user?.displayName ?? '不明'}</hover></color>`
}

export const minecraftUserNameNormalizer = (playerId: string, serverName: string): string => {
	return `<hover:show_text:'クリックしてプライベートメッセージコマンドを補完'><click:suggest_command:/tell ${playerId} >${playerId}<gray>@${serverName}</gray></click></hover>`
}

export const diceCommandToMinimessage = (data: playerChattedEvent): ({ contentToSendMinecraft: string; contentToSendDiscord: string } | null) => {
	if (!isDiceCommand(data.content)) {
		return null
	}
	const result = evalDiceCommand(data.content)
	if (result === null) {
		return null
	}
	switch (true) {
		case !(result.success || result.failure):
			return {
				contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] <hover:show_text:'クリックしてコピー'><click:copy_to_clipboard:'${data.content}'><white>${data.content} <reset><hover:show_text:'クリックしてコマンドをコピー'><click:copy_to_clipboard:'${data.content}'>${result.text}`,
				contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} ${result.text}`
			}
		case result.success:
			return {
				contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] <hover:show_text:'クリックしてコピー'><click:copy_to_clipboard:'${data.content}'><white>${data.content} <reset><hover:show_text:'クリックしてコマンドをコピー'><click:copy_to_clipboard:'${data.content}'><aqua>${result.critical ? '<bold>' : ''}${result.text}`,
				contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} ${result.text}`
			}
		case result.failure:
			return {
				contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] <hover:show_text:'クリックしてコピー'><click:copy_to_clipboard:'${data.content}'><white>${data.content} <reset><hover:show_text:'クリックしてコマンドをコピー'><click:copy_to_clipboard:'${data.content}'><red>${result.fumble ? '<bold>' : ''}${result.text}`,
				contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} ${result.text}`
			}
		default:
			return null
	}
}
