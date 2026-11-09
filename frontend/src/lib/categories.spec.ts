import { describe, expect, it } from 'vitest'

import { makeCategory } from '@/test/fixtures'

import { getMostUsedCategory, getTopCategories } from './categories'

describe('categories helpers', () => {
  const categories = [
    makeCategory({ id: '1', title: 'Mercado', transactionsCount: 3 }),
    makeCategory({ id: '2', title: 'Alimentação', transactionsCount: 12 }),
    makeCategory({ id: '3', title: 'Transporte', transactionsCount: 3 }),
  ]

  it('sorts by transactions count and then by title', () => {
    expect(getTopCategories(categories).map((category) => category.title)).toEqual([
      'Alimentação',
      'Mercado',
      'Transporte',
    ])
  })

  it('limits the number of categories', () => {
    expect(getTopCategories(categories, 2)).toHaveLength(2)
  })

  it('returns the most used category', () => {
    expect(getMostUsedCategory(categories)?.title).toBe('Alimentação')
  })

  it('returns undefined when no category is used', () => {
    expect(getMostUsedCategory([makeCategory({ transactionsCount: 0 })])).toBeUndefined()
    expect(getMostUsedCategory([])).toBeUndefined()
  })
})
