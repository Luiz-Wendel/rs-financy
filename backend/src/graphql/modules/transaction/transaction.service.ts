import type { Prisma as PrismaTypes } from '../../../generated/prisma/client.js'
import type { GraphQLContext } from '../../context.js'
import { notFoundError } from '../../errors.js'
import { findOwnedCategory } from '../category/category.service.js'
import type {
  CreateTransactionInput,
  PaginationInput,
  PeriodInput,
  TransactionFilterInput,
  UpdateTransactionInput,
} from './transaction.schemas.js'

type Prisma = GraphQLContext['prisma']

/** First day of the month and first day of the next month (dates are stored at UTC midnight). */
export function getPeriodRange({ year, month }: PeriodInput) {
  return {
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1)),
  }
}

function buildWhere(
  userId: string,
  { search, type, categoryId, period }: TransactionFilterInput,
): PrismaTypes.TransactionWhereInput {
  return {
    userId,
    ...(search && { description: { contains: search } }),
    ...(type && { type }),
    ...(categoryId && { categoryId }),
    ...(period && { date: getPeriodRange(period) }),
  }
}

export async function listTransactions(
  prisma: Prisma,
  userId: string,
  filter: TransactionFilterInput,
  { page, perPage }: PaginationInput,
) {
  const where = buildWhere(userId, filter)

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.transaction.count({ where }),
  ])

  return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) }
}

export async function createTransaction(
  prisma: Prisma,
  userId: string,
  input: CreateTransactionInput,
) {
  await findOwnedCategory(prisma, userId, input.categoryId)

  return prisma.transaction.create({
    data: { ...input, userId },
    include: { category: true },
  })
}

/** Finds a transaction of the user. Other users' transactions are reported as not found. */
export async function findOwnedTransaction(prisma: Prisma, userId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, userId } })

  if (!transaction) {
    throw notFoundError('Transaction')
  }

  return transaction
}

export async function updateTransaction(
  prisma: Prisma,
  userId: string,
  id: string,
  input: UpdateTransactionInput,
) {
  await findOwnedTransaction(prisma, userId, id)

  if (input.categoryId) {
    await findOwnedCategory(prisma, userId, input.categoryId)
  }

  return prisma.transaction.update({
    where: { id },
    data: input,
    include: { category: true },
  })
}

export async function deleteTransaction(prisma: Prisma, userId: string, id: string) {
  await findOwnedTransaction(prisma, userId, id)

  await prisma.transaction.delete({ where: { id } })

  return id
}
