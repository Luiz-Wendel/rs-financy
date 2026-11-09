import { screen, within } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { makeCategory, makeTransaction } from '@/test/fixtures'
import { api, server } from '@/test/msw/server'
import { loginAs, renderApp } from '@/test/render'

function mockDashboard({
  transactions = [] as ReturnType<typeof makeTransaction>[],
  categories = [] as ReturnType<typeof makeCategory>[],
  onRequest,
}: {
  transactions?: ReturnType<typeof makeTransaction>[]
  categories?: ReturnType<typeof makeCategory>[]
  onRequest?: (variables: unknown) => void
} = {}) {
  server.use(
    api.query('Dashboard', ({ variables }) => {
      onRequest?.(variables)
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          summary: {
            __typename: 'Summary',
            balance: 1284732,
            monthIncome: 425000,
            monthExpenses: 218045,
          },
          recentTransactions: { __typename: 'TransactionPage', items: transactions },
          categories,
        },
      })
    }),
  )
}

describe('Dashboard page', () => {
  it('shows the balance and the totals of the current month', async () => {
    loginAs()
    let variables: unknown
    mockDashboard({ onRequest: (value) => (variables = value) })
    renderApp('/')

    expect(await screen.findByText('R$ 12.847,32')).toBeInTheDocument()
    expect(screen.getByText('R$ 4.250,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 2.180,45')).toBeInTheDocument()
    const now = new Date()
    expect(variables).toEqual({ period: { year: now.getFullYear(), month: now.getMonth() + 1 } })
  })

  it('lists the recent transactions', async () => {
    loginAs()
    mockDashboard({
      transactions: [
        makeTransaction(),
        makeTransaction({
          id: 'transaction-2',
          description: 'Pagamento de Salário',
          type: 'INCOME',
          amount: 425000,
          date: '2025-12-01',
          category: makeCategory({ id: 'category-2', title: 'Receita', color: 'green' }),
        }),
      ],
    })
    renderApp('/')

    const list = await screen.findByRole('list')
    const [dinner, salary] = within(list).getAllByRole('listitem')
    expect(dinner).toHaveTextContent('Jantar no Restaurante')
    expect(dinner).toHaveTextContent('30/11/25')
    expect(dinner).toHaveTextContent('Alimentação')
    expect(dinner).toHaveTextContent('- R$ 89,50')
    expect(salary).toHaveTextContent('+ R$ 4.250,00')
    expect(screen.getByRole('link', { name: 'Ver todas' })).toHaveAttribute('href', '/transacoes')
  })

  it('shows the most used categories with their totals', async () => {
    loginAs()
    mockDashboard({
      categories: [
        makeCategory({ id: 'c1', title: 'Mercado', transactionsCount: 3, totalAmount: 29875 }),
        makeCategory({ id: 'c2', title: 'Alimentação', transactionsCount: 12 }),
        makeCategory({ id: 'c3', title: 'Viagem', transactionsCount: 1, totalAmount: 100 }),
      ],
    })
    renderApp('/')

    await screen.findByText('Mercado')
    const section = screen.getByRole('heading', { name: 'Categorias' }).closest('div')!
    const rows = within(section).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([
      'Alimentação12 itensR$ 542,30',
      'Mercado3 itensR$ 298,75',
      'Viagem1 itemR$ 1,00',
    ])
    expect(screen.getByRole('link', { name: 'Gerenciar' })).toHaveAttribute('href', '/categorias')
  })

  it('shows empty states', async () => {
    loginAs()
    mockDashboard()
    renderApp('/')

    expect(await screen.findByText('Nenhuma transação registrada ainda.')).toBeInTheDocument()
    expect(screen.getByText('Nenhuma categoria criada ainda.')).toBeInTheDocument()
  })
})

describe('Dashboard new transaction', () => {
  it('opens the transaction form', async () => {
    loginAs()
    mockDashboard()
    const { user } = renderApp('/')

    await user.click(await screen.findByRole('button', { name: 'Nova transação' }))

    expect(await screen.findByRole('dialog', { name: 'Nova transação' })).toBeInTheDocument()
  })
})

describe('Dashboard errors', () => {
  it('shows an error and loads again when retrying', async () => {
    loginAs()
    let attempts = 0
    server.use(
      api.query('Dashboard', () => {
        attempts++
        if (attempts === 1) return HttpResponse.error()
        return HttpResponse.json({
          data: {
            __typename: 'Query',
            summary: { __typename: 'Summary', balance: 100, monthIncome: 0, monthExpenses: 0 },
            recentTransactions: { __typename: 'TransactionPage', items: [] },
            categories: [],
          },
        })
      }),
    )
    const { user } = renderApp('/')

    expect(await screen.findByText('Não foi possível carregar os dados')).toBeInTheDocument()
    expect(screen.getByText('Não foi possível conectar ao servidor')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByText('R$ 1,00')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('sets the page title', async () => {
    loginAs()
    mockDashboard()
    renderApp('/')

    await screen.findByText('R$ 12.847,32')
    expect(document.title).toBe('Dashboard | Financy')
  })
})
