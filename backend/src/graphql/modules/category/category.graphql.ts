import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { listCategories } from './category.service.js'

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

  extend type Query {
    "Categories of the logged user, ordered by title"
    categories: [Category!]!
  }
`

export const categoryResolvers: Resolvers = {
  Query: {
    categories: (_, __, context) => listCategories(context.prisma, requireAuth(context)),
  },
}
