import { authResolvers, authTypeDefs } from './modules/auth/auth.graphql.js'
import { baseResolvers, baseTypeDefs } from './modules/base/base.graphql.js'
import { categoryResolvers, categoryTypeDefs } from './modules/category/category.graphql.js'
import { healthResolvers, healthTypeDefs } from './modules/health/health.graphql.js'
import {
  transactionResolvers,
  transactionTypeDefs,
} from './modules/transaction/transaction.graphql.js'
import { userResolvers, userTypeDefs } from './modules/user/user.graphql.js'

export const typeDefs = [
  baseTypeDefs,
  healthTypeDefs,
  userTypeDefs,
  authTypeDefs,
  categoryTypeDefs,
  transactionTypeDefs,
]

export const resolvers = [
  baseResolvers,
  healthResolvers,
  userResolvers,
  authResolvers,
  categoryResolvers,
  transactionResolvers,
]
