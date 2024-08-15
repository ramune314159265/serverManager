import { randomUUID, UUID } from 'crypto'

export const randomUUIDv4 = (): UUID => {
	return randomUUID()
}
