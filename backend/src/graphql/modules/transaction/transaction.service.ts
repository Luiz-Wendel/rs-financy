import type { Prisma as PrismaTypes } from '../../../generated/prisma/client.js'
import type { GraphQLContext } from '../../context.js'
import type { PaginationInput, PeriodInput, TransactionFilterInput } from './transaction.schemas.js'

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
