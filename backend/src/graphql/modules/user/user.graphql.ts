import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { updateProfileSchema } from './user.schemas.js'
import { getCurrentUser, updateProfile } from './user.service.js'

export const userTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UpdateProfileInput {
    name: String!
  }

  extend type Query {
    "The logged user"
    me: User!
  }

  extend type Mutation {
    "Updates the logged user's profile. The email can't be changed."
    updateProfile(input: UpdateProfileInput!): User!
  }
`

export const userResolvers: Resolvers = {
  Query: {
    me: (_, __, context) => getCurrentUser(context.prisma, requireAuth(context)),
  },
  Mutation: {
    updateProfile: (_, { input }, context) =>
      updateProfile(
        context.prisma,
        requireAuth(context),
        validateInput(updateProfileSchema, input),
      ),
  },
}
