import { screen } from '@testing-library/react'
import { UserRoundPlus } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Button } from './button'

describe('Button', () => {
  it('renders a solid medium button by default', () => {
    renderWithProviders(<Button>Entrar</Button>)

    const button = screen.getByRole('button', { name: 'Entrar' })
    expect(button).toHaveClass('bg-brand-base', 'h-12')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('applies the outline variant and small size', () => {
    renderWithProviders(
      <Button variant="outline" size="sm">
        Cancelar
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveClass(
      'border-gray-300',
      'bg-white',
      'h-9',
    )
  })

  it('renders an icon-only button with an accessible name', () => {
    renderWithProviders(
      <Button variant="danger" size="icon" aria-label="Excluir">
        <UserRoundPlus />
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Excluir' })).toHaveClass('text-danger', 'size-8')
  })

  it('calls onClick and respects the submit type', async () => {
    const onClick = vi.fn()
    const { user } = renderWithProviders(
      <Button type="submit" onClick={onClick}>
        Salvar
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).toHaveBeenCalledOnce()
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const { user } = renderWithProviders(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as a child element with asChild', () => {
    renderWithProviders(
      <Button asChild variant="outline">
        <a href="/cadastro">Criar conta</a>
      </Button>,
    )

    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveClass('border-gray-300')
  })
})
