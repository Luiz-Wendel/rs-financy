import { beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '../src/lib/prisma.js'
import { resetDatabase } from './helpers/database.js'
import { createCategory, createTransaction, createUser } from './helpers/factories.js'

describe('data model', () => {
  beforeEach(resetDatabase)

  it('does not allow two users with the same email', async () => {
    await createUser({ email: 'same@example.com' })

    await expect(createUser({ email: 'same@example.com' })).rejects.toThrow()
  })

  it('deletes the transactions of a category when the category is deleted', async () => {
    const user = await createUser()
    const food = await createCategory({ userId: user.id })
    const salary = await createCategory({ userId: user.id, title: 'Salário' })
    await createTransaction({ userId: user.id, categoryId: food.id })
    await createTransaction({ userId: user.id, categoryId: food.id })
    const kept = await createTransaction({
      userId: user.id,
      categoryId: salary.id,
      type: 'INCOME',
    })

    await prisma.category.delete({ where: { id: food.id } })

    const remaining = await prisma.transaction.findMany()
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).toBe(kept.id)
  })

  it('deletes categories and transactions when the user is deleted', async () => {
    const user = await createUser()
    const other = await createUser()
    const category = await createCategory({ userId: user.id })
    await createTransaction({ userId: user.id, categoryId: category.id })
    const otherCategory = await createCategory({ userId: other.id })
    await createTransaction({ userId: other.id, categoryId: otherCategory.id })

    await prisma.user.delete({ where: { id: user.id } })

    expect(await prisma.category.count()).toBe(1)
    expect(await prisma.transaction.count()).toBe(1)
    expect(await prisma.transaction.count({ where: { userId: other.id } })).toBe(1)
  })

  it('stores amounts as integer cents', async () => {
    const user = await createUser()
    const category = await createCategory({ userId: user.id })

    const transaction = await createTransaction({
      userId: user.id,
      categoryId: category.id,
      amount: 1234567,
    })

    expect(transaction.amount).toBe(1234567)
  })
})
