import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('toggles when clicking the label', async () => {
    const onCheckedChange = vi.fn()
    const { user } = renderWithProviders(
      <Checkbox label="Lembrar-me" onCheckedChange={onCheckedChange} />,
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar-me' })
    expect(checkbox).not.toBeChecked()

    await user.click(screen.getByText('Lembrar-me'))

    expect(checkbox).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
