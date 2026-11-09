import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const CREATE_TRANSACTION = /* GraphQL */ `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      description
      type
      amount
      date
      category {
        id
        title
      }
    }
  }
`

describe('createTransaction mutation', () => {
  let userId: string
  let categoryId: string
  let input: Record<string, unknown>

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId, title: 'Alimentação' })).id
    input = {
      description: 'Jantar no Restaurante',
      type: 'EXPENSE',
      amount: 8950,
      date: '2026-11-30',
      categoryId,
    }
  })

  it('creates a transaction for the logged user', async () => {
    const result = await executeOperation(CREATE_TRANSACTION, { input }, { userId })

    expect(result.errors).toBeUndefined()
    expect(result.data?.createTransaction).toEqual({
      id: expect.any(String),
      description: 'Jantar no Restaurante',
      type: 'EXPENSE',
      amount: 8950,
      date: '2026-11-30',
      category: { id: categoryId, title: 'Alimentação' },
    })
    const transaction = await prisma.transaction.findFirstOrThrow()
    expect(transaction.userId).toBe(userId)
    expect(transaction.date.toISOString()).toBe('2026-11-30T00:00:00.000Z')
  })

  it('fails with NOT_FOUND when the category belongs to another user', async () => {
    const other = await createUser()
    const otherCategory = await createCategory({ userId: other.id })

    const result = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, categoryId: otherCategory.id } },
      { userId },
    )

    expect(result.errors?.[0]).toMatchObject({
      message: 'Category not found',
      extensions: { code: ErrorCode.NOT_FOUND },
    })
    expect(await prisma.transaction.count()).toBe(0)
  })

  it('fails with BAD_USER_INPUT for an empty description or a non-positive amount', async () => {
    const result = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, description: ' ', amount: 0 } },
      { userId },
    )

    const [error] = result.errors ?? []
    expect(error?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
    expect(Object.keys(error?.extensions?.fieldErrors as object).sort()).toEqual([
      'amount',
      'description',
    ])
  })

  it('accepts amounts up to R$ 1.000.000.000,00', async () => {
    const result = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, amount: 100_000_000_000 } },
      { userId },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data?.createTransaction).toMatchObject({ amount: 100_000_000_000 })
    const transaction = await prisma.transaction.findFirstOrThrow()
    expect(transaction.amount).toBe(100_000_000_000n)
  })

  it('fails with BAD_USER_INPUT for an amount above the limit', async () => {
    const result = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, amount: 100_000_000_001 } },
      { userId },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with BAD_USER_INPUT for an invalid date or type', async () => {
    const invalidDate = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, date: '2026-02-30' } },
      { userId },
    )
    const invalidType = await executeOperation(
      CREATE_TRANSACTION,
      { input: { ...input, type: 'TRANSFER' } },
      { userId },
    )

    expect(invalidDate.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
    expect(invalidType.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(CREATE_TRANSACTION, { input })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
