import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import User from './models/user.js'
import consola from 'consola'
import { jwt_key } from './utils/config.js'
import { port } from './utils/config.js'
import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers } from './graphql/schema/resolvers.js'
import ConnectDB from './utils/database.js'

ConnectDB()

const start = async () => {
  const app = express()

  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

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
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token) {
          const decoded = jwt.verify(token, jwt_key)
          const authUser = await User.findById(decoded.id)
            .populate('repositories')
            .populate('reviewsCreated')
          return { authUser }
        }
      },
    })
  )

  httpServer.listen(port, () => {
    consola.info(`🚀 Server ready at http://localhost:${port}/`)
  })
}

start()
