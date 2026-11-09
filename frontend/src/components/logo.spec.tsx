import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Logo } from './logo'

describe('Logo', () => {
  it('renders the full logo by default', () => {
    renderWithProviders(<Logo />)

    const image = screen.getByRole('img', { name: 'Financy' })
    expect(image).toHaveAttribute('width', '134')
    expect(image).toHaveAttribute('height', '32')
  })

  it('renders only the symbol in the icon variant', () => {
    renderWithProviders(<Logo variant="icon" />)

    const image = screen.getByRole('img', { name: 'Financy' })
    expect(image).toHaveAttribute('width', '40')
    expect(image).toHaveAttribute('height', '40')
  })
})
