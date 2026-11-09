import type { Resolvers } from '../../types.js'

export const healthTypeDefs = /* GraphQL */ `
  extend type Query {
    "Returns 'ok' when the API is up"
    health: String!
  }
`

export const healthResolvers: Resolvers = {
  Query: {
    health: () => 'ok',
  },
}
