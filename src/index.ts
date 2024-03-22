import './api/index'
import './server/index'
import './websocket/child/index'
import './discord/index'

process.on('uncaughtException', err => console.error('uncaughtException:', err))
