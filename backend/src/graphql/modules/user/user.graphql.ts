import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { getCurrentUser } from './user.service.js'

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    "The logged user"
    me: User!
  }
`

export const userResolvers: Resolvers = {
  Query: {
    me: (_, __, context) => getCurrentUser(context.prisma, requireAuth(context)),
  },
}
