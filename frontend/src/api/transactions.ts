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

export const TransactionsQuery = graphql(`
  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {
    transactions(filter: $filter, page: $page, perPage: $perPage) {
      items {
        ...TransactionFields
      }
      total
      page
      perPage
      totalPages
    }
  }
`)

export const DeleteTransactionMutation = graphql(`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`)
