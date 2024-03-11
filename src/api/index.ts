import express from 'express'
import { machineRouter } from './machine'

export const app = express()
app.use('/machines', machineRouter)
