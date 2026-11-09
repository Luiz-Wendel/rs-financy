import { z } from 'zod'

const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

export function parseEnv(source: Record<string, unknown>) {
  return envSchema.safeParse(source)
}

const parsed = parseEnv(import.meta.env)

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(z.flattenError(parsed.error).fieldErrors)}`,
  )
}

export const env = parsed.data
