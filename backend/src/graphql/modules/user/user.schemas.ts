import { z } from 'zod'

export const nameSchema = z.string().trim().min(1, 'Name is required').max(100)

export const updateProfileSchema = z.object({
  name: nameSchema,
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
