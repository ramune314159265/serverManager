import { Message } from 'discord.js'

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

export const minimessageNormalizer = (content: string): string => {
	return markdownToMinimessage(URLToMinimessage(content))
}

export const discordUserNameNormalizer = (message: Message): string => {
	return `<color:${message.member?.displayHexColor ?? 'white'}><hover:show_text:'@${message.member?.user?.username}'>${message.member?.displayName}</hover></color>`
}

export const minecraftUserNameNormalizer = (playerId: string, serverName: string): string => {
	return `<hover:show_text:'クリックしてプライベートメッセージコマンドを補完'><click:suggest_command:/tell ${playerId} >${playerId}<gray>@${serverName}</gray></click></hover>`
}
