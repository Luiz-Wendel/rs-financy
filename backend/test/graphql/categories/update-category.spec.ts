import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const UPDATE_CATEGORY = /* GraphQL */ `
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      title
      description
      icon
      color
      transactionsCount
      totalAmount
    }
  }
`

describe('updateCategory mutation', () => {
  let userId: string
  let categoryId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
    const category = await createCategory({
      userId,
      title: 'Alimentação',
      description: 'Refeições',
      icon: 'utensils',
      color: 'blue',
    })
    categoryId = category.id
  })

  it('updates all the fields', async () => {
    const input = {
      title: 'Mercado',
      description: 'Compras',
      icon: 'shopping-cart',
      color: 'orange',
    }

    const result = await executeOperation(UPDATE_CATEGORY, { id: categoryId, input }, { userId })

    expect(result.errors).toBeUndefined()
    expect(result.data?.updateCategory).toMatchObject({ id: categoryId, ...input })
  })

  it('updates only the informed fields', async () => {
    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: categoryId, input: { color: 'green' } },
      { userId },
    )

    expect(result.data?.updateCategory).toMatchObject({
      title: 'Alimentação',
      description: 'Refeições',
      icon: 'utensils',
      color: 'green',
    })
  })

  it('clears the description when it is sent empty', async () => {
    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: categoryId, input: { description: '' } },
      { userId },
    )

    expect(result.data?.updateCategory).toMatchObject({ description: null })
  })

  it('returns the category transaction stats', async () => {
    await createTransaction({ userId, categoryId, amount: 4200 })

    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: categoryId, input: { title: 'Restaurantes' } },
      { userId },
    )

    expect(result.data?.updateCategory).toMatchObject({ transactionsCount: 1, totalAmount: 4200 })
  })

  it("fails with NOT_FOUND for another user's category and keeps it unchanged", async () => {
    const other = await createUser()

    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: categoryId, input: { title: 'Hacked' } },
      { userId: other.id },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
    const category = await prisma.category.findUniqueOrThrow({ where: { id: categoryId } })
    expect(category.title).toBe('Alimentação')
  })

  it('fails with NOT_FOUND for an unknown id', async () => {
    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: 'unknown-id', input: { title: 'Mercado' } },
      { userId },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.NOT_FOUND)
  })

  it('fails with BAD_USER_INPUT for invalid values', async () => {
    const result = await executeOperation(
      UPDATE_CATEGORY,
      { id: categoryId, input: { title: '', color: 'black' } },
      { userId },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(UPDATE_CATEGORY, {
      id: categoryId,
      input: { title: 'Mercado' },
    })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
