import type { GraphQLFieldResolver, GraphQLScalarType } from 'graphql'

import type { GraphQLContext } from './context.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldResolver = GraphQLFieldResolver<any, GraphQLContext, any>

export type Resolvers = Record<string, Record<string, FieldResolver> | GraphQLScalarType>
