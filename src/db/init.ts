import User from "@models/User"
const isDev = process.env.NODE_ENV === 'development'

const dbInit = () => {
    User.sync({ alter: isDev })
    console.log('ℹ️ Database is updated')
}

export default dbInit