import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../../src/graphql/errors.js'
import { prisma } from '../../../src/lib/prisma.js'
import { resetDatabase } from '../../helpers/database.js'
import { createUser } from '../../helpers/factories.js'
import { executeOperation } from '../../helpers/graphql.js'

const CREATE_CATEGORY = /* GraphQL */ `
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
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

const input = {
  title: 'Alimentação',
  description: 'Restaurantes, delivery e refeições',
  icon: 'utensils',
  color: 'blue',
}

describe('createCategory mutation', () => {
  let userId: string

  beforeEach(async () => {
    await resetDatabase()
    userId = (await createUser()).id
  })

  it('creates a category for the logged user', async () => {
    const result = await executeOperation(CREATE_CATEGORY, { input }, { userId })

    expect(result.errors).toBeUndefined()
    expect(result.data?.createCategory).toEqual({
      id: expect.any(String),
      ...input,
      transactionsCount: 0,
      totalAmount: 0,
    })
    const category = await prisma.category.findFirstOrThrow()
    expect(category.userId).toBe(userId)
  })

  it('stores an empty description as null', async () => {
    const result = await executeOperation(
      CREATE_CATEGORY,
      { input: { ...input, description: '   ' } },
      { userId },
    )

    expect(result.data?.createCategory).toMatchObject({ description: null })
  })

  it('accepts a category without description', async () => {
    const { title, icon, color } = input

    const result = await executeOperation(
      CREATE_CATEGORY,
      { input: { title, icon, color } },
      { userId },
    )

    expect(result.data?.createCategory).toMatchObject({ description: null })
  })

  it('fails with BAD_USER_INPUT for an empty title, unknown icon or unknown color', async () => {
    const result = await executeOperation(
      CREATE_CATEGORY,
      { input: { ...input, title: ' ', icon: 'rocket', color: 'black' } },
      { userId },
    )

    const [error] = result.errors ?? []
    expect(error?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
    expect(Object.keys(error?.extensions?.fieldErrors as object).sort()).toEqual([
      'color',
      'icon',
      'title',
    ])
    expect(await prisma.category.count()).toBe(0)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(CREATE_CATEGORY, { input })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
