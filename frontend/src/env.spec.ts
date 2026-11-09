import { describe, expect, it } from 'vitest'

import { env, parseEnv } from './env'

describe('env', () => {
  it('exposes the backend URL', () => {
    expect(env.VITE_BACKEND_URL).toBe('http://localhost:4000/graphql')
  })

  it('accepts a valid URL', () => {
    expect(parseEnv({ VITE_BACKEND_URL: 'https://api.financy.app/graphql' }).success).toBe(true)
  })

  it('rejects a missing or invalid backend URL', () => {
    expect(parseEnv({}).success).toBe(false)
    expect(parseEnv({ VITE_BACKEND_URL: 'not-a-url' }).success).toBe(false)
  })
})
