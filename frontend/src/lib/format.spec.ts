import { describe, expect, it } from 'vitest'

import { formatCurrency, formatItemsCount, formatShortDate, formatSignedCurrency } from './format'

describe('format', () => {
  it('formats cents as Brazilian currency', () => {
    expect(formatCurrency(1284732)).toBe('R$ 12.847,32')
    expect(formatCurrency(0)).toBe('R$ 0,00')
    expect(formatCurrency(-8950)).toBe('-R$ 89,50')
    expect(formatCurrency(100_000_000_000)).toBe('R$ 1.000.000.000,00')
  })

  it('adds the sign of the transaction type', () => {
    expect(formatSignedCurrency('INCOME', 425000)).toBe('+ R$ 4.250,00')
    expect(formatSignedCurrency('EXPENSE', 8950)).toBe('- R$ 89,50')
  })

  it('formats API dates as dd/mm/yy without timezone shifts', () => {
    expect(formatShortDate('2025-12-01')).toBe('01/12/25')
    expect(formatShortDate('2026-01-31')).toBe('31/01/26')
  })

  it('pluralizes the items count', () => {
    expect(formatItemsCount(1)).toBe('1 item')
    expect(formatItemsCount(12)).toBe('12 itens')
    expect(formatItemsCount(0)).toBe('0 itens')
  })
})
