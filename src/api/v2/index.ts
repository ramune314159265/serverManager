import express from 'express'

export const v2Router = express.Router({ mergeParams: true })

const machineRouter = (await import('./machine/index')).machineRouter
const serversRouter = (await import('./servers/index')).serversRouter

v2Router.use('/machines', machineRouter)
v2Router.use('/servers', serversRouter)

import('./ws/console')
import('./ws/main')
