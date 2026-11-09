import { screen, waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { makeCategory, makeTransaction } from '@/test/fixtures'
import { api, server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { TransactionDialog } from './transaction-dialog'

function mockCategories(
  categories = [
    makeCategory(),
    makeCategory({ id: 'category-2', title: 'Salário', color: 'green' }),
  ],
) {
  server.use(
    api.query('Categories', () => HttpResponse.json({ data: { __typename: 'Query', categories } })),
  )
}

function mockSave(operation: 'CreateTransaction' | 'UpdateTransaction') {
  const requests: unknown[] = []
  server.use(
    api.mutation(operation, ({ variables }) => {
      requests.push(variables)
      const field = operation === 'CreateTransaction' ? 'createTransaction' : 'updateTransaction'
      return HttpResponse.json({ data: { __typename: 'Mutation', [field]: makeTransaction() } })
    }),
  )
  return requests
}

describe('TransactionDialog', () => {
  it('creates a transaction', async () => {
    mockCategories()
    const requests = mockSave('CreateTransaction')
    const onOpenChange = vi.fn()
    const { user } = renderWithProviders(<TransactionDialog open onOpenChange={onOpenChange} />)

    expect(screen.getByRole('dialog', { name: 'Nova transação' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Receita' }))
    await user.type(screen.getByLabelText('Descrição'), 'Freelance')
    await user.type(screen.getByLabelText('Data'), '2025-11-24')
    await user.type(screen.getByLabelText('Valor'), '250000')
    expect(screen.getByLabelText('Valor')).toHaveValue('2.500,00')
    await user.click(screen.getByRole('combobox', { name: 'Categoria' }))
    await user.click(await screen.findByRole('option', { name: 'Salário' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    expect(requests).toEqual([
      {
        input: {
          type: 'INCOME',
          description: 'Freelance',
          date: '2025-11-24',
          amount: 250000,
          categoryId: 'category-2',
        },
      },
    ])
    expect(await screen.findByText('Transação criada')).toBeInTheDocument()
  })

  it('starts as an expense', () => {
    mockCategories()
    renderWithProviders(<TransactionDialog open onOpenChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Despesa' })).toBeChecked()
  })

  it('validates the fields', async () => {
    mockCategories()
    const requests = mockSave('CreateTransaction')
    const { user } = renderWithProviders(<TransactionDialog open onOpenChange={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Informe a descrição')).toBeInTheDocument()
    expect(screen.getByText('Informe a data')).toBeInTheDocument()
    expect(screen.getByText('Informe um valor maior que zero')).toBeInTheDocument()
    expect(screen.getByText('Selecione uma categoria')).toBeInTheDocument()
    expect(requests).toHaveLength(0)
  })

  it('edits a transaction with its current values', async () => {
    mockCategories()
    const requests = mockSave('UpdateTransaction')
    const { user } = renderWithProviders(
      <TransactionDialog open onOpenChange={() => {}} transaction={makeTransaction()} />,
    )

    expect(screen.getByRole('dialog', { name: 'Editar transação' })).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toHaveValue('Jantar no Restaurante')
    expect(screen.getByLabelText('Data')).toHaveValue('2025-11-30')
    expect(screen.getByLabelText('Valor')).toHaveValue('89,50')
    expect(await screen.findByRole('combobox', { name: 'Categoria' })).toHaveTextContent(
      'Alimentação',
    )

    await user.clear(screen.getByLabelText('Descrição'))
    await user.type(screen.getByLabelText('Descrição'), 'Jantar com amigos')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() =>
      expect(requests).toEqual([
        {
          id: 'transaction-1',
          input: {
            type: 'EXPENSE',
            description: 'Jantar com amigos',
            date: '2025-11-30',
            amount: 8950,
            categoryId: 'category-1',
          },
        },
      ]),
    )
  })

  it('tells the user to create a category first', async () => {
    mockCategories([])
    renderWithProviders(<TransactionDialog open onOpenChange={() => {}} />)

    expect(
      await screen.findByText('Crie uma categoria antes de registrar transações'),
    ).toBeInTheDocument()
  })
})
