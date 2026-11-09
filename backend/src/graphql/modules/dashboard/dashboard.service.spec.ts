import { describe, expect, it } from 'vitest'

import { currentPeriod } from './dashboard.service.js'

describe('currentPeriod', () => {
  it('returns the UTC year and month (1-12)', () => {
    expect(currentPeriod(new Date('2026-12-31T23:30:00.000Z'))).toEqual({ year: 2026, month: 12 })
    expect(currentPeriod(new Date('2027-01-01T00:00:00.000Z'))).toEqual({ year: 2027, month: 1 })
  })
})
