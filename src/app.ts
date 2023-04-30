import 'module-alias/register'
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });
import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import routes from '@routes/routes'
import dbInit from '@db/init'
import { Server } from 'http'

dbInit()

let server: Server;

export const getApplication = () => {
    const app: Application = express()

    // Body parsing Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({ origin: ['http://localhost:3000'] }))

    app.get('/', async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({ message: 'Bem-vindo! CodeHub_.' })
    })

    app.use('/api/v1', routes)

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        })
    })

    return app
}

export const start = () => {
    const app = getApplication()

    const PORT = process.env.PORT || 4000
    const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

    try {
        if (process.env.NODE_ENV === 'test') {
            server = app.listen(() => {
                console.log(`🔥 Server running on test mode`)
            })
        } else {
            server = app.listen(PORT, () => {
                console.log(`🔥 Server running on ${HOSTNAME}:${PORT}`)
            })
        }
    } catch (error: any) {
        console.log(`Error occurred: ${error.message}`)
    }
}

export const getServer = () => {
    return server;
}

start()
