import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Avatar } from './avatar'

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
