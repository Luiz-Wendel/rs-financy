import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(50).default(10),
})

export const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const periodSchema = z.object({
  year: z.number().int().min(1900).max(9999),
  month: z.number().int().min(1, 'Month must be between 1 and 12').max(12),
})

const filterObjectSchema = z.object({
  search: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || undefined),
  type: transactionTypeSchema.nullish(),
  categoryId: z.string().nullish(),
  period: periodSchema.nullish(),
})

export type TransactionFilterInput = Partial<z.output<typeof filterObjectSchema>>

export const transactionFilterSchema = filterObjectSchema
  .nullish()
  .transform((filter): TransactionFilterInput => filter ?? {})

export type PaginationInput = z.infer<typeof paginationSchema>
export type PeriodInput = z.infer<typeof periodSchema>
