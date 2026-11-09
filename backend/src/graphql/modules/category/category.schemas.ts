import { z } from 'zod'

import { CATEGORY_COLORS, CATEGORY_ICONS } from './category.constants.js'

const title = z.string().trim().min(1, 'Title is required').max(50)
const description = z
  .string()
  .trim()
  .max(200)
  .nullish()
  .transform((value) => value || null)
const icon = z.enum(CATEGORY_ICONS, { error: 'Invalid icon' })
const color = z.enum(CATEGORY_COLORS, { error: 'Invalid color' })

export const createCategorySchema = z.object({ title, description, icon, color })

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
