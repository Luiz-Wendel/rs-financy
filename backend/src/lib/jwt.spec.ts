import jwt from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'

import { env } from '../config/env.js'
import { signToken, verifyToken } from './jwt.js'

describe('jwt', () => {
  it('signs a token whose subject is the user id', () => {
    const token = signToken('user-1')

    expect(verifyToken(token)).toBe('user-1')
  })

  it('returns null for a malformed token', () => {
    expect(verifyToken('not-a-token')).toBeNull()
  })

  it('returns null for a token signed with another secret', () => {
    const token = jwt.sign({}, 'another-secret-with-16-chars', { subject: 'user-1' })

    expect(verifyToken(token)).toBeNull()
  })

  it('returns null for an expired token', () => {
    const token = jwt.sign({}, env.JWT_SECRET, { subject: 'user-1', expiresIn: -10 })

    expect(verifyToken(token)).toBeNull()
  })

  it('returns null when the token has no subject', () => {
    const token = jwt.sign({}, env.JWT_SECRET)

    expect(verifyToken(token)).toBeNull()
  })
})
