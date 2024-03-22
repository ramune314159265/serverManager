import express from 'express'

import { Machine } from '../../../machine'

export const machineRouter = express.Router({ mergeParams: true })

machineRouter.get('/', (req, res) => {
	const machines = Machine.list
	const sendData = []
	for (const machine of Object.values(machines)) {
		sendData.push({
			id: machine.id,
			online: machine.isOnline,
		})
	}

	res.send(sendData)
})
