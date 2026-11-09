import { describe, expect, it } from 'vitest'

import { buildContext, getBearerToken } from './context.js'

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
  it('exposes prisma and the request token', async () => {
    const context = await buildContext({ req: { headers: { authorization: 'Bearer abc' } } })

    expect(context.token).toBe('abc')
    expect(context.prisma).toBeDefined()
  })
})
