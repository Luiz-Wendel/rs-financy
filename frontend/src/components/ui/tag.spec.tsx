import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Tag } from './tag'

describe('Tag', () => {
  it('renders the label with the category color', () => {
    renderWithProviders(<Tag color="purple">Transporte</Tag>)

    expect(screen.getByText('Transporte')).toHaveClass('bg-purple-light', 'text-purple-dark')
  })

  it('uses the gray style without a known color', () => {
    renderWithProviders(<Tag>Outros</Tag>)

    expect(screen.getByText('Outros')).toHaveClass('bg-gray-200', 'text-gray-700')
  })
})
