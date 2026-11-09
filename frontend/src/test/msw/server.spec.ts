import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { env } from '@/env'

import { api, server } from './server'

describe('GraphQL mock server', () => {
  it('answers GraphQL operations sent to the API URL', async () => {
    server.use(api.query('Health', () => HttpResponse.json({ data: { health: 'ok' } })))

    const response = await fetch(env.VITE_BACKEND_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: 'query Health { health }' }),
    })

    expect(await response.json()).toEqual({ data: { health: 'ok' } })
  })
})
