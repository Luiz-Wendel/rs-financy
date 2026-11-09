import { graphql } from '@/gql'
import { HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { api, server } from '@/test/msw/server'

import { LoginMutation } from '@/api/auth'

import { createApolloClient } from './apollo'

const HealthQuery = graphql(`
  query Health {
    health
  }
`)

describe('createApolloClient', () => {
  it('sends the token in the Authorization header', async () => {
    let authorization: string | null = null
    server.use(
      api.query('Health', ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ data: { health: 'ok' } })
      }),
    )
    const client = createApolloClient({ getToken: () => 'abc', onUnauthenticated: vi.fn() })

    const { data } = await client.query({ query: HealthQuery })

    expect(data?.health).toBe('ok')
    expect(authorization).toBe('Bearer abc')
  })

  it('does not send the header without a token', async () => {
    let authorization: string | null = 'unset'
    server.use(
      api.query('Health', ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ data: { health: 'ok' } })
      }),
    )
    const client = createApolloClient({ getToken: () => null, onUnauthenticated: vi.fn() })

    await client.query({ query: HealthQuery })

    expect(authorization).toBeNull()
  })

  it('notifies when the session is rejected', async () => {
    server.use(
      api.query('Health', () =>
        HttpResponse.json({
          errors: [{ message: 'You must be logged in', extensions: { code: 'UNAUTHENTICATED' } }],
        }),
      ),
    )
    const onUnauthenticated = vi.fn()
    const client = createApolloClient({ getToken: () => 'expired', onUnauthenticated })

    await expect(client.query({ query: HealthQuery })).rejects.toThrow()

    expect(onUnauthenticated).toHaveBeenCalledOnce()
  })

  it('does not treat wrong login credentials as an expired session', async () => {
    server.use(
      api.mutation('Login', () =>
        HttpResponse.json({
          errors: [
            { message: 'Invalid email or password', extensions: { code: 'UNAUTHENTICATED' } },
          ],
        }),
      ),
    )
    const onUnauthenticated = vi.fn()
    const client = createApolloClient({ getToken: () => null, onUnauthenticated })

    await expect(
      client.mutate({
        mutation: LoginMutation,
        variables: { input: { email: 'john@example.com', password: 'wrong' } },
      }),
    ).rejects.toThrow('Invalid email or password')

    expect(onUnauthenticated).not.toHaveBeenCalled()
  })
})
