import type { GraphQLContext } from '../../context.js'
import { unauthenticatedError } from '../../errors.js'

type Prisma = GraphQLContext['prisma']

/** The token may outlive the account, so a missing user is treated as logged out. */
export async function getCurrentUser(prisma: Prisma, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw unauthenticatedError()
  }

  return user
}
