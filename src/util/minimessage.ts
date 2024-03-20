import { Guild, GuildMember } from 'discord.js'

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
		.replace(/(https?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig, "<click:open_url:$1><underlined><aqua>$1</aqua></underlined></click>")
}

export const mentionsToMinimessage = (content: string, guild: (Guild | null)): string => {
	return content
		.replace(/<id:home>/, () => {
			return `<aqua>サーバーガイド</aqua>`
		})
		.replace(/<id:customize>/, () => {
			return `<aqua>チャンネル&ロール</aqua>`
		})
		.replace(/<id:browse>/, () => {
			return `<aqua>チャンネル一覧</aqua>`
		})
		.replace(/@everyone/, () => {
			return `<aqua>@everyone</aqua>`
		})
		.replace(/@here/, () => {
			return `<aqua>@here</aqua>`
		})
		.replace(/<\/(.+?):(\d{5,20})>/, (match: string, p1: string) => {
			return `<aqua>/${p1}</aqua>`
		})
		.replace(/<@(\d{5,20})>/, (match: string, p1: string) => {
			return `<color:${guild?.members?.cache?.get?.(p1)?.displayHexColor ?? 'aqua'}>@${guild?.members?.cache?.get?.(p1)?.displayName ?? '不明なユーザー'}</color>`
		})
		.replace(/<@&(\d{5,20})>/, (match: string, p1: string) => {
			const rawHexColor = guild?.roles?.cache?.get?.(p1)?.hexColor
			const color = (rawHexColor === '#000000') ? null : rawHexColor
			return `<color:${color ?? 'aqua'}>@${guild?.roles?.cache?.get?.(p1)?.name ?? '不明なロール'}</color>`
		})
		.replace(/<#(\d{5,20})>/, (match: string, p1: string) => {
			return `<aqua>#${guild?.channels?.cache?.get?.(p1)?.name ?? '不明なチャンネル'}</aqua>`
		})
}

export const minimessageNormalizer = (content: string, guild: (Guild | null)): string => {
	return markdownToMinimessage(mentionsToMinimessage(URLToMinimessage(content), guild))
}

export const discordUserNameNormalizer = (member: (GuildMember | null)): string => {
	return `<color:${member?.displayHexColor ?? 'white'}><hover:show_text:'@${member?.user?.username ?? '不明'}'>${member?.displayName ?? '不明'}</hover></color>`
}

export const minecraftUserNameNormalizer = (playerId: string, serverName: string): string => {
	return `<hover:show_text:'クリックしてプライベートメッセージコマンドを補完'><click:suggest_command:/tell ${playerId} >${playerId}<gray>@${serverName}</gray></click></hover>`
}
