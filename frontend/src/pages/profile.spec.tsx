import { screen, within } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { api, server } from '@/test/msw/server'
import { loginAs, renderApp, testUser } from '@/test/render'

describe('Profile page', () => {
  it("shows the user's data with the email read-only", async () => {
    loginAs()
    renderApp('/perfil')

    expect(await screen.findByRole('heading', { name: 'Conta Teste' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome completo')).toHaveValue('Conta Teste')
    const email = screen.getByLabelText('E-mail')
    expect(email).toHaveValue('conta@teste.com')
    expect(email).toHaveAttribute('readonly')
    expect(email).toHaveAccessibleDescription('O e-mail não pode ser alterado')
  })

  it('updates the name everywhere', async () => {
    loginAs()
    const requests: unknown[] = []
    server.use(
      api.mutation('UpdateProfile', ({ variables }) => {
        requests.push(variables)
        return HttpResponse.json({
          data: {
            __typename: 'Mutation',
            updateProfile: { ...testUser, name: 'Maria Souza' },
          },
        })
      }),
    )
    const { user } = renderApp('/perfil')
    const name = await screen.findByLabelText('Nome completo')

    await user.clear(name)
    await user.type(name, 'Maria Souza')
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Perfil atualizado')).toBeInTheDocument()
    expect(requests).toEqual([{ input: { name: 'Maria Souza' } }])
    expect(screen.getByRole('heading', { name: 'Maria Souza' })).toBeInTheDocument()
    const navbar = screen.getByRole('link', { name: 'Meu perfil' })
    expect(within(navbar).getByText('MS')).toBeInTheDocument()
  })

  it('requires a name', async () => {
    loginAs()
    const { user } = renderApp('/perfil')

    await user.clear(await screen.findByLabelText('Nome completo'))
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Informe seu nome')).toBeInTheDocument()
  })

  it('signs out', async () => {
    loginAs()
    const { user, router } = renderApp('/perfil')

    await user.click(await screen.findByRole('button', { name: 'Sair da conta' }))

    expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
    expect(localStorage.getItem('financy:token')).toBeNull()
  })
})
