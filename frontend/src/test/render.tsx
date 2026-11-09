import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

/**
 * Renders a component with the app providers and returns a user-event instance.
 * Providers (router, Apollo, auth) are added here as the app grows.
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  }
}
