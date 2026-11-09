import type { Category } from '../../../generated/prisma/client.js'
import type { GraphQLContext } from '../../context.js'
import type { CreateCategoryInput } from './category.schemas.js'

type Prisma = GraphQLContext['prisma']

export interface CategoryWithStats extends Category {
  transactionsCount: number
  /** Sum of the transaction amounts in cents */
  totalAmount: number
}

async function getStats(prisma: Prisma, categoryIds: string[]) {
  const groups = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { categoryId: { in: categoryIds } },
    _count: { _all: true },
    _sum: { amount: true },
  })

  return new Map(
    groups.map((group) => [
      group.categoryId,
      { transactionsCount: group._count._all, totalAmount: group._sum.amount ?? 0 },
    ]),
  )
}

/** Adds transaction stats to the categories with a single grouped query. */
export async function withStats(
  prisma: Prisma,
  categories: Category[],
): Promise<CategoryWithStats[]> {
  const stats = await getStats(
    prisma,
    categories.map((category) => category.id),
  )

  return categories.map((category) => ({
    ...category,
    ...(stats.get(category.id) ?? { transactionsCount: 0, totalAmount: 0 }),
  }))
}

export async function listCategories(prisma: Prisma, userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { title: 'asc' },
  })

  return withStats(prisma, categories)
}

export async function createCategory(prisma: Prisma, userId: string, input: CreateCategoryInput) {
  const category = await prisma.category.create({ data: { ...input, userId } })

  return { ...category, transactionsCount: 0, totalAmount: 0 }
}
