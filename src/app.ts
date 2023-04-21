import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import httpStatus from 'http-status'
import passport from 'passport'
import session from 'express-session'
import itensRouter from '@routers/itens-router'
import authRouter from '@routers/auth'

const PORT = process.env.PORT || 4000
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Passport configs
app.use(session({ secret: "secret" }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.send('Bem-vindo! João.')
})

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use('/api', itensRouter)
app.use('/', authRouter)

app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND)
})

app.listen(PORT, () => {
    console.log(`🔥 Server running on ${HOSTNAME}:${PORT}`)
})