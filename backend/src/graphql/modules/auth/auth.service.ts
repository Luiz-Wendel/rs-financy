import { signToken } from '../../../lib/jwt.js'
import { hashPassword } from '../../../lib/password.js'
import type { GraphQLContext } from '../../context.js'
import { conflictError } from '../../errors.js'
import type { RegisterInput } from './auth.schemas.js'

type Prisma = GraphQLContext['prisma']

export async function register(prisma: Prisma, { name, email, password }: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw conflictError('Email already in use')
  }

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  })

  return { token: signToken(user.id), user }
}
