import { app } from './api'
import './server/index'
import './websocket/child/index'
import './discord/index'

app.listen(9000)

process.on('uncaughtException', err => console.error('uncaughtException:', err))
