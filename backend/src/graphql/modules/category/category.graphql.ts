import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { createCategorySchema, updateCategorySchema } from './category.schemas.js'
import { createCategory, listCategories, updateCategory } from './category.service.js'

export const categoryTypeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    title: String!
    description: String
    "Lucide icon name, e.g. 'utensils'"
    icon: String!
    "Color token: green, blue, purple, pink, red, orange or yellow"
    color: String!
    "Number of transactions in this category"
    transactionsCount: Int!
    "Sum of the transaction amounts in cents"
    totalAmount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateCategoryInput {
    title: String!
    description: String
    icon: String!
    color: String!
  }

  "Only the informed fields are updated"
  input UpdateCategoryInput {
    title: String
    description: String
    icon: String
    color: String
  }

  extend type Query {
    "Categories of the logged user, ordered by title"
    categories: [Category!]!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
  }
`

export const categoryResolvers: Resolvers = {
  Query: {
    categories: (_, __, context) => listCategories(context.prisma, requireAuth(context)),
  },
  Mutation: {
    createCategory: (_, { input }, context) =>
      createCategory(
        context.prisma,
        requireAuth(context),
        validateInput(createCategorySchema, input),
      ),
    updateCategory: (_, { id, input }, context) =>
      updateCategory(
        context.prisma,
        requireAuth(context),
        id,
        validateInput(updateCategorySchema, input),
      ),
  },
}
