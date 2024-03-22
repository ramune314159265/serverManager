import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'

import { serverConfig } from '../config/server'

export const app = express()
export const wsInstance = expressWs(app)
app.use(cors())

app.use('/api/v1', (await import('./v1/index')).v1Router)

app.listen(serverConfig.apiPort)
console.log(`http listening:${serverConfig.apiPort}`)
