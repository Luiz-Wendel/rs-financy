import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const TRANSACTIONS = /* GraphQL */ `
  query Transactions($page: Int, $perPage: Int) {
    transactions(page: $page, perPage: $perPage) {
      items {
        id
        description
        type
        amount
        date
        category {
          id
          title
          transactionsCount
        }
      }
      total
      page
      perPage
      totalPages
    }
  }
`

interface TransactionsData {
  transactions: {
    items: {
      id: string
      description: string
      type: string
      amount: number
      date: string
      category: { id: string; title: string; transactionsCount: number }
    }[]
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

describe('transactions query', () => {
  let userId: string
  let categoryId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId, title: 'Alimentação' })).id
  })

  function day(value: string) {
    return new Date(`${value}T00:00:00.000Z`)
  }

  it("lists the logged user's transactions, newest first, with their category", async () => {
    const other = await createUser()
    const otherCategory = await createCategory({ userId: other.id })
    await createTransaction({ userId, categoryId, description: 'Older', date: day('2026-11-01') })
    await createTransaction({
      userId,
      categoryId,
      description: 'Newer',
      type: 'INCOME',
      amount: 12345,
      date: day('2026-11-20'),
    })
    await createTransaction({ userId: other.id, categoryId: otherCategory.id })

    const result = await executeOperation<TransactionsData>(TRANSACTIONS, {}, { userId })

    expect(result.errors).toBeUndefined()
    const { items, total } = result.data!.transactions
    expect(total).toBe(2)
    expect(items.map((item) => item.description)).toEqual(['Newer', 'Older'])
    expect(items[0]).toMatchObject({
      type: 'INCOME',
      amount: 12345,
      date: '2026-11-20',
      category: { id: categoryId, title: 'Alimentação', transactionsCount: 2 },
    })
  })

  it('paginates with 10 items per page by default', async () => {
    for (let index = 1; index <= 12; index++) {
      await createTransaction({
        userId,
        categoryId,
        description: `T${index}`,
        date: day(`2026-11-${String(index).padStart(2, '0')}`),
      })
    }

    const first = await executeOperation<TransactionsData>(TRANSACTIONS, {}, { userId })
    const second = await executeOperation<TransactionsData>(TRANSACTIONS, { page: 2 }, { userId })

    expect(first.data?.transactions).toMatchObject({
      total: 12,
      page: 1,
      perPage: 10,
      totalPages: 2,
    })
    expect(first.data?.transactions.items).toHaveLength(10)
    expect(second.data?.transactions.items.map((item) => item.description)).toEqual(['T2', 'T1'])
  })

  it('accepts a custom page size', async () => {
    await createTransaction({ userId, categoryId })
    await createTransaction({ userId, categoryId })
    await createTransaction({ userId, categoryId })

    const result = await executeOperation<TransactionsData>(
      TRANSACTIONS,
      { perPage: 2 },
      { userId },
    )

    expect(result.data?.transactions).toMatchObject({ perPage: 2, totalPages: 2 })
    expect(result.data?.transactions.items).toHaveLength(2)
  })

  it('returns an empty page when the user has no transactions', async () => {
    const result = await executeOperation<TransactionsData>(TRANSACTIONS, {}, { userId })

    expect(result.data?.transactions).toEqual({
      items: [],
      total: 0,
      page: 1,
      perPage: 10,
      totalPages: 0,
    })
  })

  it('fails with BAD_USER_INPUT for an invalid page or page size', async () => {
    const invalidPage = await executeOperation(TRANSACTIONS, { page: 0 }, { userId })
    const tooLarge = await executeOperation(TRANSACTIONS, { perPage: 100 }, { userId })

    expect(invalidPage.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
    expect(tooLarge.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(TRANSACTIONS)

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
