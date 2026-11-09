import { signToken } from '../../../lib/jwt.js'
import { hashPassword, verifyPassword } from '../../../lib/password.js'
import type { GraphQLContext } from '../../context.js'
import { conflictError, unauthenticatedError } from '../../errors.js'
import type { LoginInput, RegisterInput } from './auth.schemas.js'

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

export async function login(prisma: Prisma, { email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } })
  // Same error for unknown email and wrong password, so registered emails are not revealed
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false

  if (!user || !isValid) {
    throw unauthenticatedError('Invalid email or password')
  }

  return { token: signToken(user.id), user }
}
