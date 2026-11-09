import { createServer } from 'node:http'

import { expressMiddleware } from '@as-integrations/express5'
import cors from 'cors'
import express from 'express'

import { env } from './config/env.js'
import { buildContext } from './graphql/context.js'
import { createApolloServer } from './graphql/server.js'

export function parseCorsOrigin(value: string): true | string[] {
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return origins.includes('*') ? true : origins
}

export async function createApp() {
  const app = express()
  const httpServer = createServer(app)
  const apollo = createApolloServer({ httpServer })

  await apollo.start()

  app.use(
    '/graphql',
    cors({ origin: parseCorsOrigin(env.CORS_ORIGIN) }),
    express.json(),
    expressMiddleware(apollo, { context: buildContext }),
  )

  return { app, httpServer, apollo }
}
