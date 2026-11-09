import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const DELETE_TRANSACTION = /* GraphQL */ `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

describe('deleteTransaction mutation', () => {
  let userId: string
  let categoryId: string
  let transactionId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId })).id
    transactionId = (await createTransaction({ userId, categoryId })).id
  })

  it('deletes the transaction and returns its id', async () => {
    const kept = await createTransaction({ userId, categoryId })

    const result = await executeOperation(DELETE_TRANSACTION, { id: transactionId }, { userId })

    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteTransaction).toBe(transactionId)
    const remaining = await prisma.transaction.findMany()
    expect(remaining.map((transaction) => transaction.id)).toEqual([kept.id])
  })

  it('keeps the category', async () => {
    await executeOperation(DELETE_TRANSACTION, { id: transactionId }, { userId })

    expect(await prisma.category.count()).toBe(1)
  })

  it("fails with NOT_FOUND for another user's transaction and keeps it", async () => {
    const other = await createUser()

    const result = await executeOperation(
      DELETE_TRANSACTION,
      { id: transactionId },
      { userId: other.id },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
    expect(await prisma.transaction.count()).toBe(1)
  })

  it('fails with NOT_FOUND for an unknown id', async () => {
    const result = await executeOperation(DELETE_TRANSACTION, { id: 'unknown-id' }, { userId })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(DELETE_TRANSACTION, { id: transactionId })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
    expect(await prisma.transaction.count()).toBe(1)
  })
})
