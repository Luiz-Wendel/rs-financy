import { describe, expect, it } from 'vitest'

import {
  formatPeriod,
  getCurrentPeriod,
  getRecentPeriods,
  periodToValue,
  valueToPeriod,
} from './period'

describe('period', () => {
  it('returns the current local month', () => {
    expect(getCurrentPeriod(new Date(2025, 10, 30))).toEqual({ year: 2025, month: 11 })
  })

  it('formats the period in Portuguese', () => {
    expect(formatPeriod({ year: 2025, month: 11 })).toBe('Novembro / 2025')
    expect(formatPeriod({ year: 2026, month: 3 })).toBe('Março / 2026')
  })

  it('converts periods to select values and back', () => {
    expect(periodToValue({ year: 2025, month: 1 })).toBe('2025-01')
    expect(valueToPeriod('2025-01')).toEqual({ year: 2025, month: 1 })
  })

  it('lists the recent months across years', () => {
    expect(getRecentPeriods(3, new Date(2026, 0, 15))).toEqual([
      { year: 2026, month: 1 },
      { year: 2025, month: 12 },
      { year: 2025, month: 11 },
    ])
  })
})
