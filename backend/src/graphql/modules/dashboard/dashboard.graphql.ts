import { requireAuth } from '../../context.js'
import type { Resolvers } from '../../types.js'
import { validateInput } from '../../validation.js'
import { periodSchema } from '../transaction/transaction.schemas.js'
import { currentPeriod, getSummary } from './dashboard.service.js'

export const dashboardTypeDefs = /* GraphQL */ `
  "Values in cents"
  type Summary {
    "All-time income minus expenses"
    balance: SafeInt!
    "Income in the period"
    monthIncome: SafeInt!
    "Expenses in the period"
    monthExpenses: SafeInt!
  }

  extend type Query {
    """
    Totals of the logged user. The period defaults to the current month (UTC);
    clients should send their local month.
    """
    summary(period: PeriodInput): Summary!
  }
`

export const dashboardResolvers: Resolvers = {
  Query: {
    summary: (_, { period }, context) =>
      getSummary(
        context.prisma,
        requireAuth(context),
        validateInput(periodSchema, period ?? currentPeriod()),
      ),
  },
}
