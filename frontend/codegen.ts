import type { CodegenConfig } from '@graphql-codegen/cli'

/** Generates typed documents in src/gql from the operations written with `graphql()`. */
const config: CodegenConfig = {
  schema: '../backend/schema.graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: { DateTime: 'string', Date: 'string' },
      },
    },
  },
}

export default config
