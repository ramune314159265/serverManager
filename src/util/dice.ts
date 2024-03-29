import bcdice from 'bcdice'
import Result from 'bcdice/lib/result'

const loader = new bcdice.DynamicLoader()

const mainGameSystem = await loader.dynamicLoad('Cthulhu')

export const isDiceCommand = (content: string): boolean => {
	return mainGameSystem.COMMAND_PATTERN.test(content)
}

export const evalDiceCommand = (command: string): (Result | null) => {
	return mainGameSystem.eval(command)
}
