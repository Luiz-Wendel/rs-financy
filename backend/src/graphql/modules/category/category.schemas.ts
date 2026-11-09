import { z } from 'zod'

import { CATEGORY_COLORS, CATEGORY_ICONS } from './category.constants.js'

const title = z.string().trim().min(1, 'Title is required').max(50)
// An empty description is stored as null; undefined means "not informed"
const description = z
  .string()
  .trim()
  .max(200)
  .nullable()
  .transform((value) => value || null)
  .optional()
const icon = z.enum(CATEGORY_ICONS, { error: 'Invalid icon' })
const color = z.enum(CATEGORY_COLORS, { error: 'Invalid color' })

export const createCategorySchema = z.object({ title, description, icon, color })

export const updateCategorySchema = z.object({
  title: title.optional(),
  description,
  icon: icon.optional(),
  color: color.optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
