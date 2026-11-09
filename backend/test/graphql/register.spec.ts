import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../src/graphql/errors.js'
import { verifyToken } from '../../src/lib/jwt.js'
import { prisma } from '../../src/lib/prisma.js'
import { verifyPassword } from '../../src/lib/password.js'
import { resetDatabase } from '../helpers/database.js'
import { createUser } from '../helpers/factories.js'
import { executeOperation } from '../helpers/graphql.js'

const REGISTER = /* GraphQL */ `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`

interface RegisterData {
  register: {
    token: string
    user: { id: string; name: string; email: string; createdAt: string }
  }
}

const input = { name: 'John Doe', email: 'john@example.com', password: '12345678' }

describe('register mutation', () => {
  beforeEach(resetDatabase)

  it('creates the user and returns a token for them', async () => {
    const result = await executeOperation<RegisterData>(REGISTER, { input })

    expect(result.errors).toBeUndefined()
    const { token, user } = result.data!.register
    expect(user).toMatchObject({ name: 'John Doe', email: 'john@example.com' })
    expect(new Date(user.createdAt).toString()).not.toBe('Invalid Date')
    expect(verifyToken(token)).toBe(user.id)
  })

  it('stores a hash instead of the plain password', async () => {
    await executeOperation(REGISTER, { input })

    const user = await prisma.user.findUniqueOrThrow({ where: { email: input.email } })
    expect(user.passwordHash).not.toBe(input.password)
    await expect(verifyPassword(input.password, user.passwordHash)).resolves.toBe(true)
  })

  it('normalizes the email and trims the name', async () => {
    const result = await executeOperation<RegisterData>(REGISTER, {
      input: { ...input, name: '  John Doe ', email: ' John@Example.COM ' },
    })

    expect(result.data?.register.user).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('fails with CONFLICT when the email is already in use', async () => {
    await createUser({ email: 'john@example.com' })

    const result = await executeOperation(REGISTER, {
      input: { ...input, email: 'JOHN@example.com' },
    })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.CONFLICT)
    expect(await prisma.user.count()).toBe(1)
  })

  it('fails with BAD_USER_INPUT for invalid fields', async () => {
    const result = await executeOperation(REGISTER, {
      input: { name: ' ', email: 'not-an-email', password: '123' },
    })

    const [error] = result.errors ?? []
    expect(error?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
    expect(Object.keys(error?.extensions?.fieldErrors as object).sort()).toEqual([
      'email',
      'name',
      'password',
    ])
    expect(await prisma.user.count()).toBe(0)
  })
})
