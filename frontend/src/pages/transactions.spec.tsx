import { screen, waitFor, within } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { makeCategory, makeTransaction } from '@/test/fixtures'
import { api, server } from '@/test/msw/server'
import { loginAs, renderApp } from '@/test/render'

type Variables = { filter: Record<string, unknown>; page: number; perPage: number }

function mockTransactions(
  items = [makeTransaction()],
  { total = items.length, totalPages = 1 } = {},
) {
  const requests: Variables[] = []
  server.use(
    api.query('Transactions', ({ variables }) => {
      requests.push(variables as Variables)
      const { page, perPage } = variables as Variables
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          transactions: { __typename: 'TransactionPage', items, total, page, perPage, totalPages },
        },
      })
    }),
    api.query('Categories', () =>
      HttpResponse.json({
        data: {
          __typename: 'Query',
          categories: [
            makeCategory(),
            makeCategory({ id: 'category-2', title: 'Transporte', color: 'purple' }),
          ],
        },
      }),
    ),
  )
  return requests
}

describe('Transactions page', () => {
  it('lists the transactions of the current month', async () => {
    loginAs()
    const requests = mockTransactions()
    renderApp('/transacoes')

    const row = (await screen.findByText('Jantar no Restaurante')).closest('tr')!
    expect(row).toHaveTextContent('30/11/25')
    expect(row).toHaveTextContent('Alimentação')
    expect(row).toHaveTextContent('Saída')
    expect(row).toHaveTextContent('- R$ 89,50')

    const now = new Date()
    expect(requests[0]).toEqual({
      filter: {
        search: null,
        type: null,
        categoryId: null,
        period: { year: now.getFullYear(), month: now.getMonth() + 1 },
      },
      page: 1,
      perPage: 10,
    })
  })

  it('filters by description, type and category', async () => {
    loginAs()
    const requests = mockTransactions()
    const { user } = renderApp('/transacoes')
    await screen.findByText('Jantar no Restaurante')

    await user.type(screen.getByLabelText('Buscar'), 'jantar')
    await waitFor(() => expect(requests.at(-1)?.filter.search).toBe('jantar'))

    await user.click(screen.getByRole('combobox', { name: 'Tipo' }))
    await user.click(await screen.findByRole('option', { name: 'Saída' }))
    await waitFor(() => expect(requests.at(-1)?.filter.type).toBe('EXPENSE'))

    await user.click(screen.getByRole('combobox', { name: 'Categoria' }))
    await user.click(await screen.findByRole('option', { name: 'Transporte' }))
    await waitFor(() => expect(requests.at(-1)?.filter.categoryId).toBe('category-2'))
  })

  it('shows all periods', async () => {
    loginAs()
    const requests = mockTransactions()
    const { user } = renderApp('/transacoes')
    await screen.findByText('Jantar no Restaurante')

    await user.click(screen.getByRole('combobox', { name: 'Período' }))
    await user.click(await screen.findByRole('option', { name: 'Todos os períodos' }))

    await waitFor(() => expect(requests.at(-1)?.filter.period).toBeNull())
  })

  it('paginates', async () => {
    loginAs()
    const requests = mockTransactions([makeTransaction()], { total: 27, totalPages: 3 })
    const { user } = renderApp('/transacoes')
    await screen.findByText('Jantar no Restaurante')

    expect(screen.getByText(/27 resultados/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Página 2' }))

    await waitFor(() => expect(requests.at(-1)?.page).toBe(2))
  })

  it('deletes a transaction after confirming', async () => {
    loginAs()
    mockTransactions()
    const deleted: unknown[] = []
    server.use(
      api.mutation('DeleteTransaction', ({ variables }) => {
        deleted.push(variables)
        return HttpResponse.json({
          data: { __typename: 'Mutation', deleteTransaction: 'transaction-1' },
        })
      }),
    )
    const { user } = renderApp('/transacoes')

    await user.click(await screen.findByRole('button', { name: 'Excluir Jantar no Restaurante' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Excluir transação' })
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    expect(await screen.findByText('Transação excluída')).toBeInTheDocument()
    expect(deleted).toEqual([{ id: 'transaction-1' }])
  })

  it('does not delete when cancelling', async () => {
    loginAs()
    mockTransactions()
    const { user } = renderApp('/transacoes')

    await user.click(await screen.findByRole('button', { name: 'Excluir Jantar no Restaurante' }))
    await user.click(await screen.findByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('shows an empty state', async () => {
    loginAs()
    mockTransactions([])
    renderApp('/transacoes')

    expect(await screen.findByText('Nenhuma transação encontrada.')).toBeInTheDocument()
  })
})
