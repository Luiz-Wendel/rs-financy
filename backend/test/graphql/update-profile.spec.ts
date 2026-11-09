import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../src/graphql/errors.js'
import { prisma } from '../../src/lib/prisma.js'
import { resetDatabase } from '../helpers/database.js'
import { createUser } from '../helpers/factories.js'
import { executeOperation } from '../helpers/graphql.js'

const UPDATE_PROFILE = /* GraphQL */ `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
    }
  }
`

describe('updateProfile mutation', () => {
  beforeEach(resetDatabase)

  it("updates the logged user's name", async () => {
    const user = await createUser({ name: 'John Doe', email: 'john@example.com' })

    const result = await executeOperation(
      UPDATE_PROFILE,
      { input: { name: '  John Smith ' } },
      { userId: user.id },
    )

    expect(result.errors).toBeUndefined()
    expect(result.data?.updateProfile).toEqual({
      id: user.id,
      name: 'John Smith',
      email: 'john@example.com',
    })
    const updated = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
    expect(updated.name).toBe('John Smith')
  })

  it('does not change other users', async () => {
    const user = await createUser({ name: 'John Doe' })
    const other = await createUser({ name: 'Jane Doe' })

    await executeOperation(UPDATE_PROFILE, { input: { name: 'John Smith' } }, { userId: user.id })

    const untouched = await prisma.user.findUniqueOrThrow({ where: { id: other.id } })
    expect(untouched.name).toBe('Jane Doe')
  })

  it('does not accept an email', async () => {
    const user = await createUser()

    const result = await executeOperation(
      UPDATE_PROFILE,
      { input: { name: 'John', email: 'new@example.com' } },
      { userId: user.id },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with BAD_USER_INPUT for an empty name', async () => {
    const user = await createUser()

    const result = await executeOperation(
      UPDATE_PROFILE,
      { input: { name: '   ' } },
      { userId: user.id },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.BAD_USER_INPUT)
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(UPDATE_PROFILE, { input: { name: 'John' } })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })

  it('fails with UNAUTHENTICATED when the user no longer exists', async () => {
    const result = await executeOperation(
      UPDATE_PROFILE,
      { input: { name: 'John' } },
      { userId: 'deleted-user-id' },
    )

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
