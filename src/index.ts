import { app } from './api'
import './server/index'
import './websocket/child/index'
import './discord/index'

app.listen(9000)
