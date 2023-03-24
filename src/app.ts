import express from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import { clear } from 'console'

const PORT = process.env.PORT || 4000
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
const app = express()

app.get('/', (req, res) => {
    res.send('Bem-vindo! João.')
})

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
})

app.listen(PORT, () => {
    console.log(`🔥 Server running on ${HOSTNAME}:${PORT}`)
})