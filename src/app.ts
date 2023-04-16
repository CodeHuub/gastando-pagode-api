import 'module-alias/register'
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import itensRouter from '@routers/itens-router'

const PORT = process.env.PORT || 4000
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Bem-vindo! João.')
})

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use('/api', itensRouter)

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
})

app.listen(PORT, () => {
    console.log(`🔥 Server running on ${HOSTNAME}:${PORT}`)
})