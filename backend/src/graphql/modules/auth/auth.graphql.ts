import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { registerSchema } from './auth.schemas.js'
import { register } from './auth.service.js'

export const authTypeDefs = /* GraphQL */ `
  type AuthPayload {
    "JWT to be sent as 'Authorization: Bearer <token>'"
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  extend type Mutation {
    "Creates an account and returns a session token"
    register(input: RegisterInput!): AuthPayload!
  }
`

export const authResolvers: Resolvers = {
  Mutation: {
    register: (_, { input }, { prisma }) => register(prisma, validateInput(registerSchema, input)),
  },
}
