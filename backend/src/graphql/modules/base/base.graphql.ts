import { DateTimeResolver } from 'graphql-scalars'

import type { Resolvers } from '../../types.js'

/** Root types and shared scalars. Each module extends the root types. */
export const baseTypeDefs = /* GraphQL */ `
  "ISO 8601 date-time string, e.g. 2026-11-09T12:00:00.000Z"
  scalar DateTime

  type Query
  type Mutation
`

export const baseResolvers: Resolvers = {
  DateTime: DateTimeResolver,
}
