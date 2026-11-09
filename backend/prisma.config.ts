import { defineConfig } from 'prisma/config'

try {
  process.loadEnvFile()
} catch {
  // .env is optional: variables may come from the environment (e.g. CI)
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
})
