import { createServer } from 'node:http'

import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'

import { buildCorsOptions } from './config/cors.js'
import { env } from './config/env.js'
import { buildContext } from './graphql/context.js'
import { createApolloServer } from './graphql/server.js'

export async function createApp() {
  const app = express()
  const httpServer = createServer(app)
  const apollo = createApolloServer({ httpServer })

  await apollo.start()

  app.use(
    '/graphql',
    cors(
      buildCorsOptions({
        origin: env.CORS_ORIGIN,
        methods: env.CORS_METHODS,
        credentials: env.CORS_CREDENTIALS,
      }),
    ),
    express.json(),
    expressMiddleware(apollo, { context: buildContext }),
  )

  return { app, httpServer, apollo }
}
