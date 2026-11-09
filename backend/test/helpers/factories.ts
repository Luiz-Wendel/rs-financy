import { randomUUID } from 'node:crypto'

import type { Prisma } from '../../src/generated/prisma/client.js'
import { prisma } from '../../src/lib/prisma.js'

export function createUser(data: Partial<Prisma.UserUncheckedCreateInput> = {}) {
  return prisma.user.create({
    data: {
      name: 'John Doe',
      email: `john-${randomUUID()}@example.com`,
      passwordHash: 'hashed-password',
      ...data,
    },
  })
}

export function createCategory(
  data: Partial<Prisma.CategoryUncheckedCreateInput> & { userId: string },
) {
  return prisma.category.create({
    data: {
      title: 'Alimentação',
      icon: 'utensils',
      color: 'blue',
      ...data,
    },
  })
}

export function createTransaction(
  data: Partial<Prisma.TransactionUncheckedCreateInput> & { userId: string; categoryId: string },
) {
  return prisma.transaction.create({
    data: {
      description: 'Jantar no restaurante',
      type: 'EXPENSE',
      amount: 8950,
      date: new Date('2026-11-01T12:00:00.000Z'),
      ...data,
    },
  })
}
