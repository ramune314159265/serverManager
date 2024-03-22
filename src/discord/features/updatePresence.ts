import { ActivityType } from 'discord.js'

import { client } from '..'

const updatePresence = () => {
    client.user?.setActivity?.(`サーバー | ${client.ws.ping === -1 ? '不明' : client.ws.ping}ms`, { type: ActivityType.Playing })
}

setInterval(updatePresence, 30 * 60 * 1000)
updatePresence()
