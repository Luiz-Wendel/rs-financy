import type { AddressInfo } from 'node:net'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../../src/app.js'
import { resetDatabase } from '../helpers/database.js'

describe('authentication over HTTP', () => {
  let app: Awaited<ReturnType<typeof createApp>>
  let url: string

  beforeAll(async () => {
    app = await createApp()
    await new Promise<void>((resolve) => app.httpServer.listen(0, resolve))
    url = `http://localhost:${(app.httpServer.address() as AddressInfo).port}/graphql`
  })

  afterAll(() => app.apollo.stop())

  beforeEach(resetDatabase)

  async function request(query: string, variables?: object, token?: string) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query, variables }),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await response.json()) as any
  }

  it('registers, logs in and fetches the logged user with the token', async () => {
    const input = { name: 'John Doe', email: 'john@example.com', password: '12345678' }

    await request('mutation ($input: RegisterInput!) { register(input: $input) { token } }', {
      input,
    })
    const login = await request(
      'mutation ($input: LoginInput!) { login(input: $input) { token } }',
      { input: { email: input.email, password: input.password } },
    )
    const me = await request('{ me { name email } }', {}, login.data.login.token)

    expect(me).toEqual({ data: { me: { name: 'John Doe', email: 'john@example.com' } } })
  })

  it('rejects requests with an invalid token', async () => {
    const me = await request('{ me { id } }', {}, 'invalid-token')

    expect(me.errors[0].extensions.code).toBe('UNAUTHENTICATED')
  })
})
