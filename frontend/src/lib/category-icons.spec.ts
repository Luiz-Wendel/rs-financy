import { Tag, Utensils } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { CATEGORY_ICON_NAMES, getCategoryIcon } from './category-icons'

describe('category icons', () => {
  it('has the sixteen icons of the design', () => {
    expect(CATEGORY_ICON_NAMES).toHaveLength(16)
  })

  it('returns the Lucide icon by name', () => {
    expect(getCategoryIcon('utensils')).toBe(Utensils)
  })

  it('falls back to a tag icon for unknown names', () => {
    expect(getCategoryIcon('rocket')).toBe(Tag)
  })
})
