import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(10),
})

export type PaginationInput = z.infer<typeof paginationSchema>
