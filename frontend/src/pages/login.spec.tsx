import { screen } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { api, server } from '@/test/msw/server'
import { renderApp, testUser } from '@/test/render'

function mockLogin() {
  const requests: unknown[] = []
  server.use(
    api.mutation('Login', ({ variables }) => {
      requests.push(variables)
      return HttpResponse.json({
        data: {
          __typename: 'Mutation',
          login: { __typename: 'AuthPayload', token: 'jwt', user: testUser },
        },
      })
    }),
  )
  return requests
}

async function fillForm(user: ReturnType<typeof renderApp>['user']) {
  await user.type(screen.getByLabelText('E-mail'), 'conta@teste.com')
  await user.type(screen.getByLabelText('Senha'), '12345678')
}

describe('Login page', () => {
  it('logs in and shows the dashboard', async () => {
    const requests = mockLogin()
    const { user } = renderApp('/')

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(requests).toEqual([{ input: { email: 'conta@teste.com', password: '12345678' } }])
  })

  it('keeps the session only for the tab unless "Lembrar-me" is checked', async () => {
    mockLogin()
    const { user } = renderApp('/')

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    await screen.findByRole('heading', { name: 'Dashboard' })

    expect(sessionStorage.getItem('financy:token')).toBe('jwt')
    expect(localStorage.getItem('financy:token')).toBeNull()
  })

  it('remembers the session when "Lembrar-me" is checked', async () => {
    mockLogin()
    const { user } = renderApp('/')

    await fillForm(user)
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: 'Entrar' }))
    await screen.findByRole('heading', { name: 'Dashboard' })

    expect(localStorage.getItem('financy:token')).toBe('jwt')
  })

  it('validates the fields before calling the API', async () => {
    const requests = mockLogin()
    const { user } = renderApp('/')

    await user.type(screen.getByLabelText('E-mail'), 'invalid')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInvalid()
    expect(requests).toHaveLength(0)
  })

  it('shows an error for wrong credentials', async () => {
    server.use(
      api.mutation('Login', () =>
        HttpResponse.json({
          errors: [
            { message: 'Invalid email or password', extensions: { code: 'UNAUTHENTICATED' } },
          ],
        }),
      ),
    )
    const { user } = renderApp('/')

    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
  })

  it('links to the sign up page', async () => {
    const { user } = renderApp('/')

    await user.click(screen.getByRole('link', { name: 'Criar conta' }))

    expect(await screen.findByRole('heading', { name: 'Criar conta' })).toBeInTheDocument()
  })
})

describe('Login page title', () => {
  it('sets the page title', async () => {
    renderApp('/')

    await screen.findByRole('heading', { name: 'Fazer login' })
    expect(document.title).toBe('Entrar | Financy')
  })
})
