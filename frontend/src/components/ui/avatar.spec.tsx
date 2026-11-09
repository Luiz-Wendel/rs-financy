import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Avatar } from './avatar'
import { Card } from './card'
import { TextLink } from './text-link'

describe('Avatar', () => {
  it("shows the user's initials", () => {
    renderWithProviders(<Avatar name="Conta Teste" />)

    expect(screen.getByText('CT')).toHaveClass('size-9')
  })

  it('has a large size for the profile page', () => {
    renderWithProviders(<Avatar name="Conta Teste" size="lg" />)

    expect(screen.getByText('CT')).toHaveClass('size-16')
  })
})

describe('Card', () => {
  it('renders its content in a bordered surface', () => {
    renderWithProviders(<Card>Saldo total</Card>)

    expect(screen.getByText('Saldo total')).toHaveClass('rounded-xl', 'border-gray-200', 'bg-white')
  })
})

describe('TextLink', () => {
  it('renders a brand-colored link', () => {
    renderWithProviders(<TextLink href="/transacoes">Ver todas</TextLink>)

    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveClass('text-brand-base')
  })
})
