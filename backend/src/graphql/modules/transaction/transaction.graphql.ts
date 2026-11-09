import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { paginationSchema, transactionFilterSchema } from './transaction.schemas.js'
import { listTransactions } from './transaction.service.js'

export const transactionTypeDefs = /* GraphQL */ `
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type Transaction {
    id: ID!
    description: String!
    type: TransactionType!
    "Amount in cents, always positive (the sign comes from the type)"
    amount: Int!
    date: Date!
    category: Category!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type TransactionPage {
    items: [Transaction!]!
    "Total of transactions matching the filters"
    total: Int!
    page: Int!
    perPage: Int!
    totalPages: Int!
  }

  input PeriodInput {
    year: Int!
    "1 (January) to 12 (December)"
    month: Int!
  }

  input TransactionFilter {
    "Case-insensitive search in the description"
    search: String
    type: TransactionType
    categoryId: ID
    "Only transactions in this month"
    period: PeriodInput
  }

  extend type Query {
    "Transactions of the logged user, newest first"
    transactions(filter: TransactionFilter, page: Int = 1, perPage: Int = 10): TransactionPage!
  }
`

export const transactionResolvers: Resolvers = {
  Transaction: {
    category: (transaction, _, { prisma }) =>
      transaction.category ??
      prisma.category.findUniqueOrThrow({ where: { id: transaction.categoryId } }),
  },
  Query: {
    transactions: (_, { filter, page, perPage }, context) =>
      listTransactions(
        context.prisma,
        requireAuth(context),
        validateInput(transactionFilterSchema, filter),
        validateInput(paginationSchema, { page, perPage }),
      ),
  },
}
