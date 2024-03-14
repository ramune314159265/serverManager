const uuidCache: { [key: string]: string } = {}

export const getSkinImageURL = async (playerId: string): Promise<string> => {
	if (!Object.hasOwn(uuidCache, playerId)) {
		const uuid = await (await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerId}`)).json()
		if(uuid.errorMessage){
			return ''
		}
		uuidCache[playerId] = uuid.id
	}
	const url = `https://crafatar.com/avatars/${uuidCache[playerId]}.png?size=128&default=MHF_Steve`
	return url
}
