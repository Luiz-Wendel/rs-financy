import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { TransactionTypeIndicator } from './transaction-type'

describe('TransactionTypeIndicator', () => {
  it('renders income as a green "Entrada"', () => {
    renderWithProviders(<TransactionTypeIndicator type="INCOME" />)

    expect(screen.getByText('Entrada')).toHaveClass('text-green-base')
  })

  it('renders expense as a red "Saída"', () => {
    renderWithProviders(<TransactionTypeIndicator type="EXPENSE" />)

    expect(screen.getByText('Saída')).toHaveClass('text-red-base')
  })
})
