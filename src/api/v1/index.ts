import express from 'express'

export const v1Router = express.Router({ mergeParams: true })

const machineRouter = (await import('./machine/index')).machineRouter
const serversRouter = (await import('./servers/index')).serversRouter

v1Router.use('/machines', machineRouter)
v1Router.use('/servers', serversRouter)

import('./ws/console')
import('./ws/main')
