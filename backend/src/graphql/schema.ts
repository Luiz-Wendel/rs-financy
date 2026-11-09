import { baseResolvers, baseTypeDefs } from './modules/base/base.graphql.js'
import { healthResolvers, healthTypeDefs } from './modules/health/health.graphql.js'

export const typeDefs = [baseTypeDefs, healthTypeDefs]

export const resolvers = [baseResolvers, healthResolvers]
