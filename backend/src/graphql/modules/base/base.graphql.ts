import { DateResolver, DateTimeResolver, SafeIntResolver } from 'graphql-scalars'

import type { Resolvers } from '../../types.js'

/** Root types and shared scalars. Each module extends the root types. */
export const baseTypeDefs = /* GraphQL */ `
  "ISO 8601 date-time string, e.g. 2026-11-09T12:00:00.000Z"
  scalar DateTime

  "Calendar date without time, e.g. 2026-11-09"
  scalar Date

  "Integer up to 2^53 - 1 (Int is 32-bit). Used for money values in cents."
  scalar SafeInt

  type Query
  type Mutation
`

export const baseResolvers: Resolvers = {
  DateTime: DateTimeResolver,
  Date: DateResolver,
  SafeInt: SafeIntResolver,
}
