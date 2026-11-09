import { screen, waitFor } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { makeCategory } from '@/test/fixtures'
import { api, server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/render'

import { CategoryDialog } from './category-dialog'

function mockSave(operation: 'CreateCategory' | 'UpdateCategory') {
  const requests: unknown[] = []
  server.use(
    api.mutation(operation, ({ variables }) => {
      requests.push(variables)
      const field = operation === 'CreateCategory' ? 'createCategory' : 'updateCategory'
      return HttpResponse.json({ data: { __typename: 'Mutation', [field]: makeCategory() } })
    }),
  )
  return requests
}

describe('CategoryDialog', () => {
  it('creates a category with the chosen icon and color', async () => {
    const requests = mockSave('CreateCategory')
    const onOpenChange = vi.fn()
    const { user } = renderWithProviders(<CategoryDialog open onOpenChange={onOpenChange} />)

    expect(screen.getByRole('dialog', { name: 'Nova categoria' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Título'), 'Viagem')
    await user.type(screen.getByLabelText('Descrição'), 'Passagens e hotéis')
    await user.click(screen.getByRole('radio', { name: 'Viagem' }))
    await user.click(screen.getByRole('radio', { name: 'Laranja' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    expect(requests).toEqual([
      {
        input: {
          title: 'Viagem',
          description: 'Passagens e hotéis',
          icon: 'baggage-claim',
          color: 'orange',
        },
      },
    ])
    expect(await screen.findByText('Categoria criada')).toBeInTheDocument()
  })

  it('starts with the first icon and color selected', () => {
    renderWithProviders(<CategoryDialog open onOpenChange={() => {}} />)

    expect(screen.getByRole('radiogroup', { name: 'Ícone' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Trabalho' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Verde' })).toBeChecked()
    expect(screen.getAllByRole('radio')).toHaveLength(16 + 7)
  })

  it('requires a title', async () => {
    const requests = mockSave('CreateCategory')
    const { user } = renderWithProviders(<CategoryDialog open onOpenChange={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Informe o título')).toBeInTheDocument()
    expect(requests).toHaveLength(0)
  })

  it('edits a category with its current values', async () => {
    const requests = mockSave('UpdateCategory')
    const { user } = renderWithProviders(
      <CategoryDialog open onOpenChange={() => {}} category={makeCategory()} />,
    )

    expect(screen.getByRole('dialog', { name: 'Editar categoria' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('Alimentação')
    expect(screen.getByRole('radio', { name: 'Alimentação' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Azul' })).toBeChecked()

    await user.clear(screen.getByLabelText('Descrição'))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() =>
      expect(requests).toEqual([
        {
          id: 'category-1',
          input: { title: 'Alimentação', description: '', icon: 'utensils', color: 'blue' },
        },
      ]),
    )
  })
})
