import { Events } from 'discord.js'
import { client } from '..'
import { minecraftWsServer } from '../../websocket/minecraft'

client.on(Events.MessageCreate, message => {
	const regExp = /<@&1034812075635126332> <@(?<userid>\d{5,20})>が https:\/\/discord.com\/channels\/930376081196875787\/(?<inviteto>\d{5,20}) に招待しています/
	if (!regExp.test(message.content)) {
		return
	}
	const execResult = regExp.exec(message.content)
	if (execResult?.groups?.userid === undefined && execResult?.groups?.inviteto === undefined) {
		return
	}
	const user = client.users.cache.get(execResult.groups.userid)
	const channel = client.channels.cache.get(execResult.groups.inviteto)
	if (!channel?.isVoiceBased()) {
		return
	}
	minecraftWsServer.clients.forEach(wsConnection => {
		wsConnection.send(JSON.stringify({
			type: 'send_chat',
			content: `${user?.username ?? '不明'}が通話 #${channel.name}に招待しています`
		}))
	})
})
