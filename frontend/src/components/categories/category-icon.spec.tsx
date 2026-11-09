import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { CategoryIcon } from './category-icon'

describe('CategoryIcon', () => {
  it('renders the icon with the category color', () => {
    const { container } = renderWithProviders(<CategoryIcon icon="utensils" color="blue" />)

    const bubble = container.firstElementChild
    expect(bubble).toHaveClass('bg-blue-light', 'text-blue-base')
    expect(bubble?.querySelector('svg')).toHaveClass('lucide-utensils')
  })
})
