import { config } from "dotenv"
config({ path: `.env.${process.env.NODE_ENV}` })

import { User } from "@models/index"


const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV !== 'test'

const dbInit = () => Promise.all([
    User.sync({ alter: isDev || isTest }),
    console.log('ℹ️ Database is updated')
])

export default dbInit