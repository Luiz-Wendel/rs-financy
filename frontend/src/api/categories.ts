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

export const CreateCategoryMutation = graphql(`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
`)

export const UpdateCategoryMutation = graphql(`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...CategoryFields
    }
  }
`)
