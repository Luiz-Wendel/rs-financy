import { z } from 'zod'

import { parseCorsOrigin } from './cors.js'

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    CORS_METHODS: z.string().default('GET,POST,OPTIONS'),
    CORS_CREDENTIALS: z.stringbool().default(false),
  })
  // With credentials, browsers reject "*"; reflecting any origin instead would let any site make
  // authenticated requests, so an explicit list of origins is required.
  .refine((env) => !(env.CORS_CREDENTIALS && parseCorsOrigin(env.CORS_ORIGIN) === true), {
    message: 'CORS_CREDENTIALS requires an explicit list of origins in CORS_ORIGIN (not "*")',
    path: ['CORS_CREDENTIALS'],
  })

export type Env = z.infer<typeof envSchema>

export function parseEnv(source: Record<string, string | undefined>) {
  return envSchema.safeParse(source)
}

const parsed = parseEnv(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', z.flattenError(parsed.error).fieldErrors)
  process.exit(1)
}

export const env: Env = parsed.data
