import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Pagination } from './pagination'

describe('Pagination', () => {
  it('shows the range and total of results', () => {
    renderWithProviders(
      <Pagination page={1} perPage={10} total={27} totalPages={3} onPageChange={() => {}} />,
    )

    expect(screen.getByText(/1 a 10/)).toBeInTheDocument()
    expect(screen.getByText(/27 resultados/)).toBeInTheDocument()
  })

  it('marks the current page and disables "previous" on the first page', () => {
    renderWithProviders(
      <Pagination page={1} perPage={10} total={27} totalPages={3} onPageChange={() => {}} />,
    )

    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeEnabled()
  })

  it('changes the page', async () => {
    const onPageChange = vi.fn()
    const { user } = renderWithProviders(
      <Pagination page={2} perPage={10} total={27} totalPages={3} onPageChange={onPageChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Página 3' }))
    await user.click(screen.getByRole('button', { name: 'Página anterior' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 3)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 1)
  })

  it('disables "next" on the last page', () => {
    renderWithProviders(
      <Pagination page={3} perPage={10} total={27} totalPages={3} onPageChange={() => {}} />,
    )

    expect(screen.getByText(/21 a 27/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
  })

  it('hides the page buttons when there are no results', () => {
    renderWithProviders(
      <Pagination page={1} perPage={10} total={0} totalPages={0} onPageChange={() => {}} />,
    )

    expect(screen.getByText(/0 resultados/)).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
