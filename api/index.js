import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
//import { ApolloServerErrorCode } from '@apollo/server/errors'
import express from 'express'
import http from 'http'
import ConnectDB from './utils/database.js'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { typeDefs } from './schema/typeDefs.js'
import { resolvers } from './schema/resolvers.js'
import consola from 'consola'
import { port } from './utils/config.js'
import { jwt_key } from './utils/config.js'
import jwt from 'jsonwebtoken'
import User from './models/user.js'

const app = express()

const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

const start = async () => {
  await server.start()

  app.use(
    '/api',
    cors(),
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer')) {
          const decodedToken = jwt.verify(auth.substring(7), jwt_key)
          const authUser = await User.findById(decodedToken.id)

          return { authUser }
        }
      },
    })
  )

  ConnectDB().then(() => {
    httpServer.listen(port, () => {
      consola.info(`🚀 Server ready at http://localhost:${port}/`)
    })
  })
}

start()

export default httpServer
