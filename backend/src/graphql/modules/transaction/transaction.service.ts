import type { Prisma as PrismaTypes } from '../../../generated/prisma/client.js'
import type { GraphQLContext } from '../../context.js'
import type { PaginationInput } from './transaction.schemas.js'

type Prisma = GraphQLContext['prisma']

export async function listTransactions(
  prisma: Prisma,
  userId: string,
  { page, perPage }: PaginationInput,
) {
  const where: PrismaTypes.TransactionWhereInput = { userId }

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
