import { describe, expect, it } from 'vitest'

import { formatCurrencyInput, parseCurrencyInput } from './currency-input'

describe('currency input', () => {
  it('reads the digits as cents', () => {
    expect(parseCurrencyInput('0,00')).toBe(0)
    expect(parseCurrencyInput('0,005')).toBe(5)
    expect(parseCurrencyInput('1.234,567')).toBe(1234567)
    expect(parseCurrencyInput('')).toBe(0)
  })

  it('limits the amount to the API maximum', () => {
    expect(parseCurrencyInput('99.999.999.999,99')).toBe(100_000_000)
  })

  it('formats cents with two decimals', () => {
    expect(formatCurrencyInput(0)).toBe('0,00')
    expect(formatCurrencyInput(8950)).toBe('89,50')
    expect(formatCurrencyInput(123456)).toBe('1.234,56')
  })
})
