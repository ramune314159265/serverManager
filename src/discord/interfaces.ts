import { ColorResolvable } from 'discord.js'

export interface colors {
	join: ColorResolvable;
	move: ColorResolvable;
	leave: ColorResolvable;
	death: ColorResolvable;
	normalAdvancement: ColorResolvable;
	challengeAdvancement: ColorResolvable;
}

export interface config {
	token: string,
	noticeChannelId: string,
	mentionRoleId: string,
	colors: colors,
	addresses: {
		serverAddress1: string,
		serverAddress2: string
	}
}
