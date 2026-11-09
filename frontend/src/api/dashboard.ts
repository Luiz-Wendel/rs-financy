import { graphql } from '@/gql'

export const DashboardQuery = graphql(`
  query Dashboard($period: PeriodInput!) {
    summary(period: $period) {
      balance
      monthIncome
      monthExpenses
    }
    recentTransactions: transactions(perPage: 5) {
      items {
        ...TransactionFields
      }
    }
    categories {
      ...CategoryFields
    }
  }
`)
