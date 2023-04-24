import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config()
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import router from '@routers/router'
import dbInit from '@db/init'

dbInit()

const PORT = process.env.PORT || 4000
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send('Bem-vindo! João.')
})

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use('/api/v1', router)

app.use((req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND)
})

app.listen(PORT, () => {
    console.log(`🔥 Server running on ${HOSTNAME}:${PORT}`)
})
