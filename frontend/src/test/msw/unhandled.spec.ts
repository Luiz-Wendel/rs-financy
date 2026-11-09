import { describe, expect, it } from 'vitest'

import { env } from '@/env'

describe('GraphQL mock server', () => {
  it('fails requests without a handler instead of hitting the real API', async () => {
    await expect(
      fetch(env.VITE_BACKEND_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: 'query Unknown { unknown }' }),
      }),
    ).rejects.toThrow()
  })
})
