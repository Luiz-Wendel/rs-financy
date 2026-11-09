import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const TRANSACTIONS = /* GraphQL */ `
  query Transactions($filter: TransactionFilter) {
    transactions(filter: $filter) {
      items {
        description
      }
      total
    }
  }
`

interface TransactionsData {
  transactions: { items: { description: string }[]; total: number }
}

describe('transactions query filters', () => {
  let userId: string
  let foodId: string
  let salaryId: string

  async function descriptions(filter: object) {
    const result = await executeOperation<TransactionsData>(TRANSACTIONS, { filter }, { userId })

    expect(result.errors).toBeUndefined()
    return result.data!.transactions.items.map((item) => item.description).sort()
  }

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    foodId = (await createCategory({ userId, title: 'Alimentação' })).id
    salaryId = (await createCategory({ userId, title: 'Salário' })).id

    await createTransaction({
      userId,
      categoryId: foodId,
      description: 'Jantar no Restaurante',
      date: new Date('2026-10-31T00:00:00.000Z'),
    })
    await createTransaction({
      userId,
      categoryId: foodId,
      description: 'Compras no Mercado',
      date: new Date('2026-11-01T00:00:00.000Z'),
    })
    await createTransaction({
      userId,
      categoryId: salaryId,
      description: 'Salário de Novembro',
      type: 'INCOME',
      date: new Date('2026-11-30T00:00:00.000Z'),
    })
  })

  it('searches by description ignoring case', async () => {
    expect(await descriptions({ search: 'restaurante' })).toEqual(['Jantar no Restaurante'])
  })

  it('filters by type', async () => {
    expect(await descriptions({ type: 'INCOME' })).toEqual(['Salário de Novembro'])
    expect(await descriptions({ type: 'EXPENSE' })).toEqual([
      'Compras no Mercado',
      'Jantar no Restaurante',
    ])
  })

  it('filters by category', async () => {
    expect(await descriptions({ categoryId: salaryId })).toEqual(['Salário de Novembro'])
  })

  it('filters by month including its first and last days', async () => {
    expect(await descriptions({ period: { year: 2026, month: 11 } })).toEqual([
      'Compras no Mercado',
      'Salário de Novembro',
    ])
    expect(await descriptions({ period: { year: 2026, month: 10 } })).toEqual([
      'Jantar no Restaurante',
    ])
  })

  it('combines filters and counts only the matching transactions', async () => {
    const result = await executeOperation<TransactionsData>(
      TRANSACTIONS,
      { filter: { type: 'EXPENSE', period: { year: 2026, month: 11 } } },
      { userId },
    )

    expect(result.data?.transactions).toEqual({
      items: [{ description: 'Compras no Mercado' }],
      total: 1,
    })
  })

  it('ignores an empty search', async () => {
    expect(await descriptions({ search: '  ' })).toHaveLength(3)
  })

  it('fails with BAD_USER_INPUT for an invalid month', async () => {
    const result = await executeOperation(
      TRANSACTIONS,
      { filter: { period: { year: 2026, month: 13 } } },
      { userId },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })
})
