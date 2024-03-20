import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'
import { serverConfig } from '../config/server'

export const app = express()
app.use(cors())
expressWs(app)

app.use('/api/v1', (await import('./v1/index')).v1Router)

app.listen(serverConfig.apiPort)
