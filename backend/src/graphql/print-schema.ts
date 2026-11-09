import { buildSchema, printSchema } from 'graphql'

import { typeDefs } from './schema.js'

/** The API schema in SDL, used by the frontend to generate typed operations. */
export function printApiSchema() {
  return printSchema(buildSchema(typeDefs.join('\n')))
}
