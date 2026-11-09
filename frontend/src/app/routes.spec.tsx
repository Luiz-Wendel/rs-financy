import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { loginAs, renderApp } from '@/test/render'

describe('routes', () => {
  describe('logged out', () => {
    it('shows the login at "/"', async () => {
      renderApp('/')

      expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
      expect(screen.queryByRole('navigation', { name: 'Principal' })).not.toBeInTheDocument()
    })

    it('shows the sign up page', async () => {
      renderApp('/cadastro')

      expect(await screen.findByRole('heading', { name: 'Criar conta' })).toBeInTheDocument()
    })

    it('redirects private pages to the login', async () => {
      const { router } = renderApp('/transacoes')

      expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/')
    })
  })

  describe('logged in', () => {
    it('shows the dashboard at "/" with the navbar', async () => {
      loginAs()
      renderApp('/')

      expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
      const nav = screen.getByRole('navigation', { name: 'Principal' })
      expect(within(nav).getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('shows the private pages', async () => {
      loginAs()
      renderApp('/categorias')

      expect(await screen.findByRole('heading', { name: 'Categorias' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Categorias' })).toHaveAttribute(
        'aria-current',
        'page',
      )
    })

    it('redirects the sign up page to the dashboard', async () => {
      loginAs()
      const { router } = renderApp('/cadastro')

      expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
      expect(router.state.location.pathname).toBe('/')
    })

    it('navigates with the navbar', async () => {
      loginAs()
      const { user } = renderApp('/')
      await screen.findByRole('heading', { name: 'Dashboard' })

      await user.click(screen.getByRole('link', { name: 'Transações' }))
      expect(await screen.findByRole('heading', { name: 'Transações' })).toBeInTheDocument()

      await user.click(screen.getByRole('link', { name: 'Meu perfil' }))
      expect(await screen.findByRole('heading', { name: 'Perfil' })).toBeInTheDocument()
    })

    it("shows the user's initials in the navbar", async () => {
      loginAs()
      renderApp('/')

      expect(await screen.findByText('CT')).toBeInTheDocument()
    })
  })

  it('redirects unknown URLs to "/"', async () => {
    const { router } = renderApp('/nao-existe')

    expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/')
  })
})
