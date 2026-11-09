import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const UPDATE_TRANSACTION = /* GraphQL */ `
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id
      description
      type
      amount
      date
      category {
        id
      }
    }
  }
`

describe('updateTransaction mutation', () => {
  let userId: string
  let categoryId: string
  let transactionId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId })).id
    transactionId = (
      await createTransaction({
        userId,
        categoryId,
        description: 'Jantar',
        type: 'EXPENSE',
        amount: 8950,
        date: new Date('2026-11-30T00:00:00.000Z'),
      })
    ).id
  })

  it('updates all the fields', async () => {
    const salary = await createCategory({ userId, title: 'Salário' })
    const input = {
      description: 'Freelance',
      type: 'INCOME',
      amount: 250000,
      date: '2026-11-24',
      categoryId: salary.id,
    }

    const result = await executeOperation(
      UPDATE_TRANSACTION,
      { id: transactionId, input },
      { userId },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data?.updateTransaction).toEqual({
      id: transactionId,
      description: 'Freelance',
      type: 'INCOME',
      amount: 250000,
      date: '2026-11-24',
      category: { id: salary.id },
    })
  })

  it('updates only the informed fields', async () => {
    const result = await executeOperation(
      UPDATE_TRANSACTION,
      { id: transactionId, input: { amount: 9990 } },
      { userId },
    )

    expect(result.data?.updateTransaction).toEqual({
      id: transactionId,
      description: 'Jantar',
      type: 'EXPENSE',
      amount: 9990,
      date: '2026-11-30',
      category: { id: categoryId },
    })
  })

  it("fails with NOT_FOUND for another user's transaction and keeps it unchanged", async () => {
    const other = await createUser()

    const result = await executeOperation(
      UPDATE_TRANSACTION,
      { id: transactionId, input: { amount: 1 } },
      { userId: other.id },
    )

    expect(result.errors?.[0]).toMatchObject({
      message: 'Transaction not found',
      extensions: { code: ErrorCode.NOT_FOUND },
    })
    const transaction = await prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
    })
    expect(transaction.amount).toBe(8950)
  })

  it("fails with NOT_FOUND when moving to another user's category", async () => {
    const other = await createUser()
    const otherCategory = await createCategory({ userId: other.id })

    const result = await executeOperation(
      UPDATE_TRANSACTION,
      { id: transactionId, input: { categoryId: otherCategory.id } },
      { userId },
    )

    expect(result.errors?.[0]).toMatchObject({
      message: 'Category not found',
      extensions: { code: ErrorCode.NOT_FOUND },
    })
  })

  it('fails with BAD_USER_INPUT for invalid values', async () => {
    const result = await executeOperation(
      UPDATE_TRANSACTION,
      { id: transactionId, input: { description: '', amount: -10 } },
      { userId },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(UPDATE_TRANSACTION, {
      id: transactionId,
      input: { amount: 1 },
    })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
