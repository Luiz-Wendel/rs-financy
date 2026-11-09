import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../src/graphql/errors.js'
import { verifyToken } from '../../src/lib/jwt.js'
import { hashPassword } from '../../src/lib/password.js'
import { resetDatabase } from '../helpers/database.js'
import { createUser } from '../helpers/factories.js'
import { executeOperation } from '../helpers/graphql.js'

const LOGIN = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`

interface LoginData {
  login: { token: string; user: { id: string; email: string } }
}

describe('login mutation', () => {
  beforeEach(async () => {
    await resetDatabase()
    await createUser({
      email: 'john@example.com',
      passwordHash: await hashPassword('12345678'),
    })
  })

  it('returns a token for valid credentials', async () => {
    const result = await executeOperation<LoginData>(LOGIN, {
      input: { email: 'john@example.com', password: '12345678' },
    })

    expect(result.errors).toBeUndefined()
    const { token, user } = result.data!.login
    expect(user.email).toBe('john@example.com')
    expect(verifyToken(token)).toBe(user.id)
  })

  it('ignores email case and surrounding spaces', async () => {
    const result = await executeOperation<LoginData>(LOGIN, {
      input: { email: ' JOHN@example.com ', password: '12345678' },
    })

    expect(result.errors).toBeUndefined()
  })

  it('fails with the same error for a wrong password or an unknown email', async () => {
    const wrongPassword = await executeOperation(LOGIN, {
      input: { email: 'john@example.com', password: 'wrong-password' },
    })
    const unknownEmail = await executeOperation(LOGIN, {
      input: { email: 'jane@example.com', password: '12345678' },
    })

    for (const result of [wrongPassword, unknownEmail]) {
      expect(result.data).toBeNull()
      expect(result.errors?.[0]).toMatchObject({
        message: 'Invalid email or password',
        extensions: { code: ErrorCode.UNAUTHENTICATED },
      })
    }
  })

  it('fails with BAD_USER_INPUT for an invalid email', async () => {
    const result = await executeOperation(LOGIN, {
      input: { email: 'invalid', password: '12345678' },
    })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })
})
