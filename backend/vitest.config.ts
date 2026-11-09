import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // graphql ships CJS (main) and ESM (module) builds. Node (and @apollo/server) load the CJS one,
    // so force the same build in tests to avoid two GraphQLError classes (`instanceof` checks fail).
    alias: [{ find: /^graphql$/, replacement: 'graphql/index.js' }],
  },
  test: {
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    globalSetup: ['test/global-setup.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'file:./test.db',
      JWT_SECRET: 'test-secret-with-at-least-16-chars',
    },
    // All test files share a single SQLite database
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**', 'src/**/*.spec.ts', 'src/server.ts'],
    },
  },
})
