import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const DELETE_CATEGORY = /* GraphQL */ `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`

describe('deleteCategory mutation', () => {
  let userId: string
  let categoryId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    categoryId = (await createCategory({ userId })).id
  })

  it('deletes the category and returns its id', async () => {
    const result = await executeOperation(DELETE_CATEGORY, { id: categoryId }, { userId })

    expect(result.errors).toBeUndefined()
    expect(result.data?.deleteCategory).toBe(categoryId)
    expect(await prisma.category.count()).toBe(0)
  })

  it('also deletes the transactions of the category', async () => {
    const other = await createCategory({ userId, title: 'Salário' })
    await createTransaction({ userId, categoryId })
    await createTransaction({ userId, categoryId })
    await createTransaction({ userId, categoryId: other.id })

    await executeOperation(DELETE_CATEGORY, { id: categoryId }, { userId })

    expect(await prisma.transaction.count()).toBe(1)
    expect(await prisma.transaction.count({ where: { categoryId: other.id } })).toBe(1)
  })

  it("fails with NOT_FOUND for another user's category and keeps it", async () => {
    const other = await createUser()

    const result = await executeOperation(DELETE_CATEGORY, { id: categoryId }, { userId: other.id })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
    expect(await prisma.category.count()).toBe(1)
  })

  it('fails with NOT_FOUND for an unknown id', async () => {
    const result = await executeOperation(DELETE_CATEGORY, { id: 'unknown-id' }, { userId })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(DELETE_CATEGORY, { id: categoryId })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
    expect(await prisma.category.count()).toBe(1)
  })
})
