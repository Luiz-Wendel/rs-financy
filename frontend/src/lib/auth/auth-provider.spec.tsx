import { act, screen } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { api, server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { notifySessionExpired } from './session-events'
import { tokenStorage } from './token-storage'
import { useAuth } from './use-auth'

const testUser = {
  __typename: 'User' as const,
  id: 'user-1',
  name: 'Conta Teste',
  email: 'conta@teste.com',
}

function AuthStatus() {
  const { status, user, signIn, signOut } = useAuth()

  return (
    <div>
      <p>status: {status}</p>
      <p>user: {user?.name ?? 'none'}</p>
      <button
        type="button"
        onClick={() => signIn({ token: 'new-token', user: testUser }, { remember: false })}
      >
        sign in
      </button>
      <button type="button" onClick={signOut}>
        sign out
      </button>
    </div>
  )
}

function mockMe() {
  server.use(api.query('Me', () => HttpResponse.json({ data: { me: testUser } })))
}

describe('AuthProvider', () => {
  it('is unauthenticated without a stored token', () => {
    renderWithProviders(<AuthStatus />)

    expect(screen.getByText('status: unauthenticated')).toBeInTheDocument()
  })

  it('loads the user when a token is stored', async () => {
    tokenStorage.set('stored-token', { remember: true })
    mockMe()

    renderWithProviders(<AuthStatus />)

    expect(screen.getByText('status: loading')).toBeInTheDocument()
    expect(await screen.findByText('status: authenticated')).toBeInTheDocument()
    expect(screen.getByText('user: Conta Teste')).toBeInTheDocument()
  })

  it('signs in without fetching the user again', async () => {
    const { user: actor } = renderWithProviders(<AuthStatus />)

    await actor.click(screen.getByRole('button', { name: 'sign in' }))

    expect(screen.getByText('status: authenticated')).toBeInTheDocument()
    expect(screen.getByText('user: Conta Teste')).toBeInTheDocument()
    expect(sessionStorage.getItem('financy:token')).toBe('new-token')
  })

  it('signs out and clears the token', async () => {
    tokenStorage.set('stored-token', { remember: true })
    mockMe()
    const { user: actor } = renderWithProviders(<AuthStatus />)
    await screen.findByText('status: authenticated')

    await actor.click(screen.getByRole('button', { name: 'sign out' }))

    expect(screen.getByText('status: unauthenticated')).toBeInTheDocument()
    expect(tokenStorage.get()).toBeNull()
  })

  it('signs out when the stored token is rejected', async () => {
    tokenStorage.set('expired-token', { remember: true })
    server.use(
      api.query('Me', () =>
        HttpResponse.json({
          errors: [{ message: 'You must be logged in', extensions: { code: 'UNAUTHENTICATED' } }],
        }),
      ),
    )

    renderWithProviders(<AuthStatus />)

    expect(await screen.findByText('status: unauthenticated')).toBeInTheDocument()
    expect(tokenStorage.get()).toBeNull()
  })

  it('signs out when any request reports an expired session', async () => {
    tokenStorage.set('stored-token', { remember: true })
    mockMe()
    renderWithProviders(<AuthStatus />)
    await screen.findByText('status: authenticated')

    act(() => notifySessionExpired())

    expect(screen.getByText('status: unauthenticated')).toBeInTheDocument()
  })
})
