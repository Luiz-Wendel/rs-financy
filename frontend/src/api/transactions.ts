import { graphql } from '@/gql'

export const TransactionFieldsFragment = graphql(`
  fragment TransactionFields on Transaction {
    id
    description
    type
    amount
    date
    category {
      ...CategoryBaseFields
    }
  }
`)
