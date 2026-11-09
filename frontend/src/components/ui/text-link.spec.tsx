import { screen } from '@testing-library/react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { TextLink } from './text-link'

describe('TextLink', () => {
  it('renders a brand-colored anchor', () => {
    renderWithProviders(<TextLink href="/transacoes">Ver todas</TextLink>)

    const link = screen.getByRole('link', { name: 'Ver todas' })
    expect(link).toHaveAttribute('href', '/transacoes')
    expect(link).toHaveClass('text-brand-base', 'hover:border-brand-base')
  })

  it('renders an icon next to the label', () => {
    renderWithProviders(
      <TextLink href="/transacoes">
        Ver todas
        <ChevronRight aria-hidden />
      </TextLink>,
    )

    expect(screen.getByRole('link', { name: 'Ver todas' }).querySelector('svg')).toBeInTheDocument()
  })

  it('styles a router link with asChild', () => {
    renderWithProviders(
      <TextLink asChild>
        <Link to="/categorias">Gerenciar</Link>
      </TextLink>,
    )

    const link = screen.getByRole('link', { name: 'Gerenciar' })
    expect(link).toHaveAttribute('href', '/categorias')
    expect(link).toHaveClass('text-brand-base')
  })

  it('styles a button with asChild', async () => {
    const onClick = vi.fn()
    const { user } = renderWithProviders(
      <TextLink asChild>
        <button type="button" onClick={onClick}>
          Recuperar senha
        </button>
      </TextLink>,
    )

    const button = screen.getByRole('button', { name: 'Recuperar senha' })
    await user.click(button)

    expect(button).toHaveClass('text-brand-base')
    expect(onClick).toHaveBeenCalledOnce()
  })
})
