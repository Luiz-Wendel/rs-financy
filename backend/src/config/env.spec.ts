import { describe, expect, it } from 'vitest'

import { parseEnv } from './env.js'

const validEnv = {
  DATABASE_URL: 'file:./dev.db',
  JWT_SECRET: 'a-secret-with-at-least-16-chars',
}

describe('parseEnv', () => {
  it('applies defaults for optional variables', () => {
    const result = parseEnv(validEnv)

    expect(result.success).toBe(true)
    expect(result.data).toEqual({
      ...validEnv,
      NODE_ENV: 'development',
      PORT: 4000,
      JWT_EXPIRES_IN: '7d',
      CORS_ORIGIN: 'http://localhost:5173',
    })
  })

  it('coerces PORT to a number', () => {
    const result = parseEnv({ ...validEnv, PORT: '3333' })

    expect(result.data?.PORT).toBe(3333)
  })

  it('fails when DATABASE_URL is missing', () => {
    const result = parseEnv({ JWT_SECRET: validEnv.JWT_SECRET })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['DATABASE_URL'])
  })

  it('fails when JWT_SECRET is shorter than 16 characters', () => {
    const result = parseEnv({ ...validEnv, JWT_SECRET: 'short' })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['JWT_SECRET'])
  })

  it('fails when NODE_ENV is not a known environment', () => {
    const result = parseEnv({ ...validEnv, NODE_ENV: 'staging' })

    expect(result.success).toBe(false)
  })
})
