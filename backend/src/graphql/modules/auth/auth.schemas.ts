import { z } from 'zod'

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email('Invalid email'))

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: emailSchema,
  password: z.string().min(8, 'Password must have at least 8 characters').max(72),
})

export type RegisterInput = z.infer<typeof registerSchema>
