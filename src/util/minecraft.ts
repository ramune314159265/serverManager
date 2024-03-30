import { readFile } from 'fs/promises'
import { fileURLToPath } from "node:url"
import path from 'path'

import { advancementData } from '../server/interfaces'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const langData: { [key: string]: string } = JSON.parse((await readFile(path.resolve(__dirname, '../../assets/minecraft_lang.json'))).toString())
const serverOriginalLangData: { [key: string]: string } = JSON.parse((await readFile(path.resolve(__dirname, '../../assets/minecraft_lang_original.json'))).toString())

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

const originalDeathMessagesRegexps: { [key: string]: RegExp } = {}
for (const [key, value] of Object.entries(serverOriginalLangData)) {
	if (!key.startsWith('death.')) {
		continue
	}
	const regRegex = new RegExp(value.replace(/%([0-9])\$s/g, '(?<s$1>\\w+)'))
	originalDeathMessagesRegexps[key] = regRegex
}

const getDeathTranslateKey = (content: string): (string | null) => {
	for (const [key, regex] of Object.entries(originalDeathMessagesRegexps)) {
		if (!regex.test(content)) {
			continue
		}
		return key
	}
	return null
}

export const translateFromDeathMessage = (content: string): string => {
	const translateKey = getDeathTranslateKey(content)
	if (translateKey === null) {
		return content
	}
	const result = originalDeathMessagesRegexps[translateKey].exec(content)
	const translatedContent = langData[translateKey]
	if (!result?.groups) {
		return translatedContent
	}
	console.log(result.groups)
	let processed = translatedContent
	for (const [index, value] of Object.entries(result.groups)) {
		processed = processed.replaceAll(`%${index[1]}$s`, value)
	}
	return processed
}
