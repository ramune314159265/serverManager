export const markdownToMinimessage = (content: string) => {
	return content.replace(/\*\*(.+?)\*\*/g, "<bold>$1</bold>")
		.replace(/\*(.+?)\*/g, "<italic>$1</italic>")
		.replace(/__(.+?)__/g, "<underlined>$1</underlined>")
		.replace(/~~(.+?)~~/g, "<strikethrough>$1</strikethrough>")
		.replace(/`(.+?)`/g, "<font:uniform>$1</font>")
		.replace(/\|\|(.+?)\|\|/g, "<gray><hover:show_text:'$1'>[隠されたメッセージ]</hover></gray>")
}
