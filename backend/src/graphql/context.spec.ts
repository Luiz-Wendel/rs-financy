import { GraphQLError } from 'graphql'
import { describe, expect, it } from 'vitest'

import { signToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'
import { buildContext, getBearerToken, requireAuth } from './context.js'
import { ErrorCode } from './errors.js'

describe('getBearerToken', () => {
  it('extracts the token from a Bearer authorization header', () => {
    expect(getBearerToken({ authorization: 'Bearer abc.def.ghi' })).toBe('abc.def.ghi')
  })

  it('accepts the scheme in any case', () => {
    expect(getBearerToken({ authorization: 'bearer abc' })).toBe('abc')
  })

  it('returns null when the header is missing', () => {
    expect(getBearerToken({})).toBeNull()
  })

  it('returns null for other schemes or an empty token', () => {
    expect(getBearerToken({ authorization: 'Basic abc' })).toBeNull()
    expect(getBearerToken({ authorization: 'Bearer' })).toBeNull()
  })
})

describe('buildContext', () => {
  it('sets the user id from a valid token', async () => {
    const token = signToken('user-1')

    const context = await buildContext({ req: { headers: { authorization: `Bearer ${token}` } } })

    expect(context.userId).toBe('user-1')
    expect(context.prisma).toBeDefined()
  })

  it('sets a null user id for an invalid token', async () => {
    const context = await buildContext({ req: { headers: { authorization: 'Bearer invalid' } } })

    expect(context.userId).toBeNull()
  })

  it('sets a null user id for anonymous requests', async () => {
    const context = await buildContext({ req: { headers: {} } })

    expect(context.userId).toBeNull()
  })
})

describe('requireAuth', () => {
  it('returns the user id when logged in', () => {
    expect(requireAuth({ prisma, userId: 'user-1' })).toBe('user-1')
  })

  it('throws UNAUTHENTICATED when anonymous', () => {
    expect(() => requireAuth({ prisma, userId: null })).toThrow(GraphQLError)
    expect(() => requireAuth({ prisma, userId: null })).toThrow(
      expect.objectContaining({ extensions: { code: ErrorCode.UNAUTHENTICATED } }),
    )
  })
})
