import { servers } from '../server'
import { playerChattedEvent } from '../server/interfaces'
import { URLToMinimessage, minecraftUserNameNormalizer } from './minimessage'
import { convertToHiragana, isRomaji } from './romaji'

export const japaneseNormalizer = async (data: playerChattedEvent): Promise<{ contentToSendMinecraft: string; contentToSendDiscord: string }> => {
	const isNeededToJapanese = isRomaji(data.content)
	if (!isNeededToJapanese) {
		return new Promise((resolve) => {
			resolve({
				contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] ${URLToMinimessage(data.content)}`,
				contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content}`
			})
		})
	}

	try {
		const toHiragana = convertToHiragana(data.content)
		const IMEHandled = (await (await fetch(`https://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(toHiragana)}`)).json())
			.map((i: string) => i[1][0])
			.join('')
		const isOmitted = (IMEHandled === '') || (IMEHandled === data.content)
		return {
			contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].shortName)}] ${URLToMinimessage(data.content)} ${isOmitted ? '' : `<reset><gold>(${URLToMinimessage(IMEHandled)})</gold>`}`,
			contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} ${isOmitted ? '' : `(${IMEHandled})`}`
		}
	} catch (e) {
		return {
			contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].shortName)}] ${URLToMinimessage(data.content)} <reset><red>(エラー)</red>`,
			contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (エラー)`
		}
	}
}
