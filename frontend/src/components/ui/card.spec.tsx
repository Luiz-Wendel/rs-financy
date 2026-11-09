import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Card } from './card'

describe('Card', () => {
  it('renders its content in a white surface with border and 12px radius', () => {
    renderWithProviders(<Card>Saldo total</Card>)

    expect(screen.getByText('Saldo total')).toHaveClass('rounded-xl', 'border-gray-200', 'bg-white')
  })

  it('merges custom classes, letting them override the defaults', () => {
    renderWithProviders(<Card className="rounded-none p-6">Conteúdo</Card>)

    const card = screen.getByText('Conteúdo')
    expect(card).toHaveClass('rounded-none', 'p-6', 'bg-white')
    expect(card).not.toHaveClass('rounded-xl')
  })

  it('forwards other props to the element', () => {
    renderWithProviders(
      <Card role="region" aria-label="Resumo">
        Conteúdo
      </Card>,
    )

    expect(screen.getByRole('region', { name: 'Resumo' })).toBeInTheDocument()
  })
})
