import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.PORT
export const jwt_key = process.env.JWT_KEY
const mongo_url_dev = process.env.MONGODB_URI
const mongo_url_prod = process.env.MONGODB_URI

export const environment = {
  development: {
    dbString: mongo_url_dev,
  },

  production: {
    dbString: mongo_url_prod,
  },
}
