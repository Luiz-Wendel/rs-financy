import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'
import { AppProviders } from './app/providers'

describe('App', () => {
  it('renders the login page for visitors', async () => {
    render(
      <AppProviders>
        <App />
      </AppProviders>,
    )

    expect(await screen.findByRole('heading', { name: 'Fazer login' })).toBeInTheDocument()
  })
})
