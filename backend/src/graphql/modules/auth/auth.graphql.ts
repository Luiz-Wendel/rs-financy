import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { loginSchema, registerSchema } from './auth.schemas.js'
import { login, register } from './auth.service.js'

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

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    "Creates an account and returns a session token"
    register(input: RegisterInput!): AuthPayload!
    "Authenticates with email and password and returns a session token"
    login(input: LoginInput!): AuthPayload!
  }
`

export const authResolvers: Resolvers = {
  Mutation: {
    register: (_, { input }, { prisma }) => register(prisma, validateInput(registerSchema, input)),
    login: (_, { input }, { prisma }) => login(prisma, validateInput(loginSchema, input)),
  },
}
