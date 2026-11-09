import type { GraphQLFieldResolver } from 'graphql'

import type { GraphQLContext } from './context.js'

type FieldResolvers = Record<string, GraphQLFieldResolver<unknown, GraphQLContext>>

export type Resolvers = Record<string, FieldResolvers>
