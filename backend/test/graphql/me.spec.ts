import { beforeEach, describe, expect, it } from 'vitest'

import { ErrorCode } from '../../src/graphql/errors.js'
import { resetDatabase } from '../helpers/database.js'
import { createUser } from '../helpers/factories.js'
import { executeOperation } from '../helpers/graphql.js'

const ME = /* GraphQL */ `
  query Me {
    me {
      id
      name
      email
    }
  }
`

describe('me query', () => {
  beforeEach(resetDatabase)

  it('returns the logged user', async () => {
    const user = await createUser({ name: 'John Doe', email: 'john@example.com' })

    const result = await executeOperation(ME, {}, { userId: user.id })

    expect(result.errors).toBeUndefined()
    expect(result.data?.me).toEqual({ id: user.id, name: 'John Doe', email: 'john@example.com' })
  })

  it('fails with UNAUTHENTICATED when anonymous', async () => {
    const result = await executeOperation(ME)

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })

  it('fails with UNAUTHENTICATED when the user no longer exists', async () => {
    const result = await executeOperation(ME, {}, { userId: 'deleted-user-id' })

    expect(result.errors?.[0]?.extensions?.code).toBe(ErrorCode.UNAUTHENTICATED)
  })
})
