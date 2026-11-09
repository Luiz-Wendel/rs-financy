import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse } from 'msw'
import type { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router'

import { AppProviders } from '@/app/providers'
import { routes } from '@/app/routes'
import { tokenStorage } from '@/lib/auth/token-storage'

import { api, server } from './msw/server'

export const testUser = {
  __typename: 'User' as const,
  id: 'user-1',
  name: 'Conta Teste',
  email: 'conta@teste.com',
}

/** Starts the test logged in: stores a token and answers the `me` query. */
export function loginAs(user = testUser) {
  tokenStorage.set('test-token', { remember: true })
  server.use(api.query('Me', () => HttpResponse.json({ data: { __typename: 'Query', me: user } })))
}

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial URL for components that use the router (Link, NavLink...) */
  route?: string
}

/**
 * Renders a component inside the app providers (Apollo client talking to the MSW server and
 * the auth provider) and a memory router. Returns a user-event instance.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: RenderWithProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppProviders>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AppProviders>
    )
  }

  return { user: userEvent.setup(), ...render(ui, { wrapper: Wrapper, ...options }) }
}

/** Renders the whole app at the given URL. */
export function renderApp(route = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [route] })

  return {
    user: userEvent.setup(),
    router,
    ...render(
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>,
    ),
  }
}
