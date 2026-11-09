import type { Server } from 'node:http'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'

import type { GraphQLContext } from './context.js'
import { resolvers, typeDefs } from './schema.js'

export function createApolloServer({ httpServer }: { httpServer?: Server } = {}) {
  return new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    plugins: httpServer ? [ApolloServerPluginDrainHttpServer({ httpServer })] : [],
  })
}
