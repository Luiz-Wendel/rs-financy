import { graphql } from '@/gql'

export const UserFieldsFragment = graphql(`
  fragment UserFields on User {
    id
    name
    email
  }
`)

export const MeQuery = graphql(`
  query Me {
    me {
      ...UserFields
    }
  }
`)

export const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`)

export const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`)
