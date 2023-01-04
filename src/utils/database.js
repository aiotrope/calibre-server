import { environment } from './config.js'
import mongoose from 'mongoose'
import consola from 'consola'

const ConnectDB = async () => {
  mongoose.set('strictQuery', false)
  const env = process.env.NODE_ENV || 'development'

  let dbURL = environment[env].dbString

  const opts = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  try {
    const conn = await mongoose.connect(dbURL, opts)
    consola.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    consola.error(`connection error: ${error}`)
    process.exit(1)
  }
}

export default ConnectDB
