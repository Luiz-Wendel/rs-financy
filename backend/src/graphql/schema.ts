import { authResolvers, authTypeDefs } from './modules/auth/auth.graphql.js'
import { baseResolvers, baseTypeDefs } from './modules/base/base.graphql.js'
import { healthResolvers, healthTypeDefs } from './modules/health/health.graphql.js'
import { userTypeDefs } from './modules/user/user.graphql.js'

export const typeDefs = [baseTypeDefs, healthTypeDefs, userTypeDefs, authTypeDefs]

export const resolvers = [baseResolvers, healthResolvers, authResolvers]
