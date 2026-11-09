import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ErrorCode } from '../../src/graphql/errors.js'
import { resetDatabase } from '../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../helpers/factories.js'
import { executeOperation } from '../helpers/graphql.js'

const SUMMARY = /* GraphQL */ `
  query Summary($period: PeriodInput) {
    summary(period: $period) {
      balance
      monthIncome
      monthExpenses
    }
  }
`

describe('summary query', () => {
  let userId: string
  let categoryId: string

  function add(type: 'INCOME' | 'EXPENSE', amount: number, date: string, owner = userId) {
    return createTransaction({
      userId: owner,
      categoryId,
      type,
      amount,
      date: new Date(`${date}T00:00:00.000Z`),
    })
  }

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId })).id

    await add('INCOME', 500000, '2026-10-05')
    await add('EXPENSE', 100000, '2026-10-20')
    await add('INCOME', 425000, '2026-11-01')
    await add('EXPENSE', 8950, '2026-11-15')
    await add('EXPENSE', 10000, '2026-11-30')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the all-time balance and the totals of the informed month', async () => {
    const result = await executeOperation(
      SUMMARY,
      { period: { year: 2026, month: 11 } },
      { userId },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data?.summary).toEqual({
      balance: 500000 - 100000 + 425000 - 8950 - 10000,
      monthIncome: 425000,
      monthExpenses: 18950,
    })
  })

  it('uses the current month when no period is informed', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-15T12:00:00.000Z'))

    const result = await executeOperation(SUMMARY, {}, { userId })

    expect(result.data?.summary).toMatchObject({ monthIncome: 500000, monthExpenses: 100000 })
  })

  it("ignores other users' transactions", async () => {
    const other = await createUser()
    const otherCategory = await createCategory({ userId: other.id })
    await createTransaction({
      userId: other.id,
      categoryId: otherCategory.id,
      type: 'INCOME',
      amount: 999999,
      date: new Date('2026-11-10T00:00:00.000Z'),
    })

    const result = await executeOperation(
      SUMMARY,
      { period: { year: 2026, month: 11 } },
      { userId },
    )

    expect(result.data?.summary).toMatchObject({ monthIncome: 425000 })
  })

  it('returns zeros when the user has no transactions', async () => {
    const newUser = await createUser()

    const result = await executeOperation(SUMMARY, {}, { userId: newUser.id })

    expect(result.data?.summary).toEqual({ balance: 0, monthIncome: 0, monthExpenses: 0 })
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(SUMMARY)

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})

describe('summary query with large amounts', () => {
  beforeEach(resetDatabase)

  it('sums amounts beyond the 32-bit integer limit', async () => {
    const userId = (await createUser()).id
    const categoryId = (await createCategory({ userId })).id
    for (let index = 0; index < 3; index++) {
      await createTransaction({
        userId,
        categoryId,
        type: 'INCOME',
        amount: 100_000_000_000,
        date: new Date('2026-11-10T00:00:00.000Z'),
      })
    }

    const result = await executeOperation(
      `query { summary(period: { year: 2026, month: 11 }) { balance monthIncome } categories { totalAmount } }`,
      {},
      { userId },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data).toEqual({
      summary: { balance: 300_000_000_000, monthIncome: 300_000_000_000 },
      categories: [{ totalAmount: 300_000_000_000 }],
    })
  })
})
