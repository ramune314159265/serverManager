import romajiConv from '@koozaki/romaji-conv'
import { servers } from '../server'
import { playerChattedEvent } from '../server/interfaces'
import { URLToMinimessage, minecraftUserNameNormalizer } from './minimessage'

export const japaneseNormalizer = async (data: playerChattedEvent): Promise<{ contentToSendMinecraft: string; contentToSendDiscord: string }> => {
	//ひらがな、カタカナが含まれていなかったら必要
	const isNeededToJapanese = !/(?:[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF61-\uFF9F])/.test(data.content)
	if (!isNeededToJapanese) {
		return new Promise((resolve) => {
			resolve({
				contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].name)}] ${URLToMinimessage(data.content)}`,
				contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content}`
			})
		})
	}

	try {
		const toHiragana = romajiConv(data.content).toHiragana()
		const IMEHandled = (await (await fetch(`https://www.google.com/transliterate?langpair=ja-Hira|ja&text=${encodeURIComponent(toHiragana)}`)).json())
			.map((i: string) => i[1][0])
			.join('')
		return {
			contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].shortName)}] ${URLToMinimessage(data.content)} <reset><gold>(${URLToMinimessage(IMEHandled)})</gold>`,
			contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (${IMEHandled})`
		}
	} catch (e) {
		return {
			contentToSendMinecraft: `[<green>Minecraft</green> | ${minecraftUserNameNormalizer(data.playerId, servers[data.serverId].shortName)}] ${URLToMinimessage(data.content)} <reset><red>(エラー)</red>`,
			contentToSendDiscord: `[Minecraft | ${data.playerId}@${servers[data.serverId].name}] ${data.content} (エラー)`
		}
	}
}
