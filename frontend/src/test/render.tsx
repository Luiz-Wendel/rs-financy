import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

import { AppProviders } from '@/app/providers'

/**
 * Renders a component inside the app providers (Apollo client talking to the MSW server and
 * the auth provider) and returns a user-event instance.
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AppProviders, ...options }),
  }
}
