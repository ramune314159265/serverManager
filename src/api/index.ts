import express from 'express'
import { machineRouter } from './v1/machine'

export const app = express()
app.use('/api/v1/machines', machineRouter)
