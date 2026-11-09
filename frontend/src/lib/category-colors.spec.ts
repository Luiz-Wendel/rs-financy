import { describe, expect, it } from 'vitest'

import { CATEGORY_COLORS, getCategoryColorClasses, isCategoryColor } from './category-colors'

describe('category colors', () => {
  it('has the seven colors of the design', () => {
    expect(CATEGORY_COLORS).toEqual(['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow'])
  })

  it('uses the light background with dark text for tags and base color for icons', () => {
    expect(getCategoryColorClasses('blue')).toEqual({
      tag: 'bg-blue-light text-blue-dark',
      icon: 'bg-blue-light text-blue-base',
      swatch: 'bg-blue-base',
      text: 'text-blue-base',
    })
  })

  it('has classes for every color', () => {
    for (const color of CATEGORY_COLORS) {
      expect(getCategoryColorClasses(color).tag).toContain(`bg-${color}-light`)
    }
  })

  it('falls back to a neutral style for unknown colors', () => {
    expect(getCategoryColorClasses('black').tag).toBe('bg-gray-200 text-gray-700')
  })

  it('identifies valid colors', () => {
    expect(isCategoryColor('green')).toBe(true)
    expect(isCategoryColor('black')).toBe(false)
  })
})
