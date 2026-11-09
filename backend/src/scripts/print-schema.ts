import { writeFileSync } from 'node:fs'

// Importing the schema loads the resolvers, which validate the env. Printing the schema doesn't
// touch the database, so placeholders are enough when the variables are not set.
process.env.DATABASE_URL ??= 'file:./schema-print.db'
process.env.JWT_SECRET ??= 'placeholder-secret-for-schema-print'

const { printApiSchema } = await import('../graphql/print-schema.js')

writeFileSync('schema.graphql', printApiSchema())
console.log('schema.graphql updated')
