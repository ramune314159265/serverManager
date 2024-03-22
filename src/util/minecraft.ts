import { readFile } from 'fs/promises'
import { fileURLToPath } from "node:url"
import path from 'path'

import { advancementData } from '../server/interfaces'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const langData = JSON.parse((await readFile(path.resolve(__dirname, '../../assets/minecraft_lang.json'))).toString())

export const translateFromAdvancementData = (data: advancementData): advancementData => {
	const key = data.key.split('/').join('.')
	const translatedName = langData[`advancements.${key}.title`]
	const translatedDescription = langData[`advancements.${key}.description`]
	return {
		...data,
		name: translatedName ?? data.name,
		description: translatedDescription ?? data.description
	}
}
