import { z } from 'zod'

const envSchema = z.object({
  VITE_BACKEND_URL: z.url(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${JSON.stringify(z.flattenError(parsed.error).fieldErrors)}`,
  )
}

export const env = parsed.data
