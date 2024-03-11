import express from 'express'
import { machineRouter } from './v1/machine'
import { serverRouter } from './v1/server'

export const app = express()
app.use('/api/v1/machines', machineRouter)
app.use('/api/v1/servers', serverRouter)
