import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'
import { renderWithProviders } from './test/render'

describe('App', () => {
  it('renders the Financy logo', () => {
    renderWithProviders(<App />)

    expect(screen.getByRole('img', { name: 'Financy' })).toBeInTheDocument()
  })
})
