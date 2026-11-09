import type { Prisma as PrismaTypes } from '../../../generated/prisma/client.js'
import type { GraphQLContext } from '../../context.js'
import type { PeriodInput } from '../transaction/transaction.schemas.js'
import { getPeriodRange } from '../transaction/transaction.service.js'

type Prisma = GraphQLContext['prisma']

/** Sums the amounts by transaction type (in cents). */
async function sumByType(prisma: Prisma, where: PrismaTypes.TransactionWhereInput) {
  const groups = await prisma.transaction.groupBy({
    by: ['type'],
    where,
    _sum: { amount: true },
  })

  const sumOf = (type: 'INCOME' | 'EXPENSE') =>
    Number(groups.find((group) => group.type === type)?._sum.amount ?? 0)

  return { income: sumOf('INCOME'), expenses: sumOf('EXPENSE') }
}

export function currentPeriod(now = new Date()): PeriodInput {
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 }
}

export async function getSummary(prisma: Prisma, userId: string, period: PeriodInput) {
  const [allTime, month] = await Promise.all([
    sumByType(prisma, { userId }),
    sumByType(prisma, { userId, date: getPeriodRange(period) }),
  ])

  return {
    balance: allTime.income - allTime.expenses,
    monthIncome: month.income,
    monthExpenses: month.expenses,
  }
}
