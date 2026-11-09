import { graphql } from '@/gql'

export const CategoryBaseFieldsFragment = graphql(`
  fragment CategoryBaseFields on Category {
    id
    title
    description
    icon
    color
  }
`)

export const CategoryFieldsFragment = graphql(`
  fragment CategoryFields on Category {
    ...CategoryBaseFields
    transactionsCount
    totalAmount
  }
`)

export const CategoriesQuery = graphql(`
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`)

export const DeleteCategoryMutation = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`)
