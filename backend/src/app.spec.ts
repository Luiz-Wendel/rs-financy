import type { AddressInfo } from 'node:net'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createApp } from './app.js'

describe('HTTP server', () => {
  let app: Awaited<ReturnType<typeof createApp>>
  let url: string

  beforeAll(async () => {
    app = await createApp()
    await new Promise<void>((resolve) => app.httpServer.listen(0, resolve))
    const { port } = app.httpServer.address() as AddressInfo
    url = `http://localhost:${port}/graphql`
  })

  afterAll(async () => {
    await app.apollo.stop()
  })

  function postQuery(origin: string) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify({ query: '{ health }' }),
    })
  }

  it('serves GraphQL at /graphql', async () => {
    const response = await postQuery('http://localhost:5173')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: { health: 'ok' } })
  })

  it('sends CORS headers for the allowed origin', async () => {
    const response = await postQuery('http://localhost:5173')

    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })

  it('answers preflight requests with the allowed methods and without credentials', async () => {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        origin: 'http://localhost:5173',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,authorization',
      },
    })

    expect(response.status).toBe(204)
    expect(response.headers.get('access-control-allow-methods')).toBe('GET,POST,OPTIONS')
    expect(response.headers.get('access-control-allow-credentials')).toBeNull()
  })

  it('does not send CORS headers for other origins', async () => {
    const response = await postQuery('http://evil.example.com')

    expect(response.headers.get('access-control-allow-origin')).toBeNull()
  })
})
