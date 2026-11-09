import { screen } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { api, server } from '@/test/msw/server'
import { renderApp, testUser } from '@/test/render'

describe('Sign up page', () => {
  it('creates the account and shows the dashboard', async () => {
    const requests: unknown[] = []
    server.use(
      api.mutation('Register', ({ variables }) => {
        requests.push(variables)
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            register: { __typename: 'AuthPayload', token: 'jwt', user: testUser },
          },
        })
      }),
    )
    const { user, router } = renderApp('/cadastro')

    await user.type(screen.getByLabelText('Nome completo'), 'Conta Teste')
    await user.type(screen.getByLabelText('E-mail'), 'conta@teste.com')
    await user.type(screen.getByLabelText('Senha'), '12345678')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(localStorage.getItem('financy:token')).toBe('jwt')
    expect(requests).toEqual([
      { input: { name: 'Conta Teste', email: 'conta@teste.com', password: '12345678' } },
    ])
  })

  it('shows the password rule as a helper and as an error', async () => {
    const { user } = renderApp('/cadastro')
    const password = screen.getByLabelText('Senha')

    expect(password).toHaveAccessibleDescription('A senha deve ter no mínimo 8 caracteres')

    await user.type(password, '123')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Informe seu nome')).toBeInTheDocument()
    expect(password).toBeInvalid()
  })

  it('shows an error when the email is already in use', async () => {
    server.use(
      api.mutation('Register', () =>
        HttpResponse.json({
          errors: [{ message: 'Email already in use', extensions: { code: 'CONFLICT' } }],
        }),
      ),
    )
    const { user } = renderApp('/cadastro')

    await user.type(screen.getByLabelText('Nome completo'), 'Conta Teste')
    await user.type(screen.getByLabelText('E-mail'), 'conta@teste.com')
    await user.type(screen.getByLabelText('Senha'), '12345678')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(await screen.findByText('Este e-mail já está em uso')).toBeInTheDocument()
  })

  it('links back to the login', async () => {
    const { user } = renderApp('/cadastro')

    await user.click(screen.getByRole('link', { name: 'Fazer login' }))

    expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
  })
})
