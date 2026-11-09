import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { resetDatabase } from '../../helpers/database.js'
import { createCategory, createTransaction, createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const CATEGORIES = /* GraphQL */ `
  query Categories {
    categories {
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

interface CategoriesData {
  categories: {
    id: string
    title: string
    transactionsCount: number
    totalAmount: number
  }[]
}

describe('categories query', () => {
  beforeEach(resetDatabase)

  it("lists only the logged user's categories, ordered by title", async () => {
    const user = await createUser()
    const other = await createUser()
    await createCategory({ userId: user.id, title: 'Transporte' })
    await createCategory({ userId: user.id, title: 'Alimentação' })
    await createCategory({ userId: other.id, title: 'Mercado' })

    const result = await executeOperation<CategoriesData>(CATEGORIES, {}, { userId: user.id })

    expect(result.errors).toBeUndefined()
    expect(result.data?.categories.map((category) => category.title)).toEqual([
      'Alimentação',
      'Transporte',
    ])
  })

  it('returns the transactions count and total amount of each category', async () => {
    const user = await createUser()
    const food = await createCategory({ userId: user.id, title: 'Alimentação' })
    const empty = await createCategory({ userId: user.id, title: 'Viagem' })
    await createTransaction({ userId: user.id, categoryId: food.id, amount: 1000 })
    await createTransaction({ userId: user.id, categoryId: food.id, amount: 2550 })

    const result = await executeOperation<CategoriesData>(CATEGORIES, {}, { userId: user.id })

    expect(result.data?.categories).toEqual([
      expect.objectContaining({ id: food.id, transactionsCount: 2, totalAmount: 3550 }),
      expect.objectContaining({ id: empty.id, transactionsCount: 0, totalAmount: 0 }),
    ])
  })

  it('returns an empty list when the user has no categories', async () => {
    const user = await createUser()

    const result = await executeOperation<CategoriesData>(CATEGORIES, {}, { userId: user.id })

    expect(result.data?.categories).toEqual([])
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(CATEGORIES)

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
