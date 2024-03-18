import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'
import { serverConfig } from '../config/server'

export const app = express()
app.use(cors())
expressWs(app)

const machineRouter = (await import('./v1/machine/index')).machineRouter
const serverRouter = (await import('./v1/servers/index')).serversRouter

app.use('/api/v1/machines', machineRouter)
app.use('/api/v1/servers', serverRouter)

app.listen(serverConfig.apiPort)
