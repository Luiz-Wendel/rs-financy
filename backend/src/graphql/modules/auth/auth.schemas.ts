import { z } from 'zod'

import { nameSchema } from '../user/user.schemas.js'

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email('Invalid email'))

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(8, 'Password must have at least 8 characters').max(72),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
