import { environment } from './config.js'
import mongoose from 'mongoose'
import consola from 'consola'


const MongoDatabase = () => {
  mongoose.set('strictQuery', false)
  const env = process.env.NODE_ENV || 'development'

  let dbURL = environment[env].dbString

  const opts = {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  mongoose.connect(dbURL, opts)

  const db = mongoose.connection
  db.once('open', () => {
    consola.success(`Database connected: ${dbURL}`)
  })

  db.on('error', (error) => {
    consola.error(`connection error: ${error}`)
  })
}

export default MongoDatabase
