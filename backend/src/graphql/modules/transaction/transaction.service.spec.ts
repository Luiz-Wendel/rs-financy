import { describe, expect, it } from 'vitest'

import { getPeriodRange } from './transaction.service.js'

describe('getPeriodRange', () => {
  it('returns the start of the month and the start of the next month', () => {
    expect(getPeriodRange({ year: 2026, month: 2 })).toEqual({
      gte: new Date('2026-02-01T00:00:00.000Z'),
      lt: new Date('2026-03-01T00:00:00.000Z'),
    })
  })

  it('rolls over to the next year in December', () => {
    expect(getPeriodRange({ year: 2026, month: 12 })).toEqual({
      gte: new Date('2026-12-01T00:00:00.000Z'),
      lt: new Date('2027-01-01T00:00:00.000Z'),
    })
  })
})
