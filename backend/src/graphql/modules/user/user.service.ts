import type { GraphQLContext } from '../../context.js'
import { unauthenticatedError } from '../../errors.js'
import type { UpdateProfileInput } from './user.schemas.js'

type Prisma = GraphQLContext['prisma']

/** The token may outlive the account, so a missing user is treated as logged out. */
export async function getCurrentUser(prisma: Prisma, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw unauthenticatedError()
  }

  return user
}

export async function updateProfile(prisma: Prisma, userId: string, { name }: UpdateProfileInput) {
  await getCurrentUser(prisma, userId)

  return prisma.user.update({ where: { id: userId }, data: { name } })
}
