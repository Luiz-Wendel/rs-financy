import { screen, within } from '@testing-library/react'
import { HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { makeCategory } from '@/test/fixtures'
import { api, server } from '@/test/msw/server'
import { loginAs, renderApp } from '@/test/render'

function mockCategories(
  categories = [
    makeCategory(),
    makeCategory({
      id: 'category-2',
      title: 'Transporte',
      description: 'Gasolina e viagens',
      icon: 'car-front',
      color: 'purple',
      transactionsCount: 8,
    }),
  ],
) {
  server.use(
    api.query('Categories', () => HttpResponse.json({ data: { __typename: 'Query', categories } })),
  )
}

describe('Categories page', () => {
  it('shows the totals and the most used category', async () => {
    loginAs()
    mockCategories()
    renderApp('/categorias')

    const totalCategories = (await screen.findByText('Total de categorias')).parentElement!
    expect(totalCategories).toHaveTextContent('2')
    expect(screen.getByText('Total de transações').parentElement).toHaveTextContent('20')
    expect(screen.getByText('Categoria mais utilizada').parentElement).toHaveTextContent(
      'Alimentação',
    )
  })

  it('lists the categories with their details', async () => {
    loginAs()
    mockCategories()
    renderApp('/categorias')

    const card = (await screen.findByRole('heading', { name: 'Transporte' })).parentElement!
    expect(card).toHaveTextContent('Gasolina e viagens')
    expect(card).toHaveTextContent('8 itens')
  })

  it('warns that the transactions are deleted with the category', async () => {
    loginAs()
    mockCategories()
    const deleted: unknown[] = []
    server.use(
      api.mutation('DeleteCategory', ({ variables }) => {
        deleted.push(variables)
        return HttpResponse.json({ data: { __typename: 'Mutation', deleteCategory: 'category-2' } })
      }),
    )
    const { user } = renderApp('/categorias')

    await user.click(await screen.findByRole('button', { name: 'Excluir Transporte' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Excluir categoria' })
    expect(dialog).toHaveTextContent('As 8 transações desta categoria também serão excluídas.')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    expect(await screen.findByText('Categoria excluída')).toBeInTheDocument()
    expect(deleted).toEqual([{ id: 'category-2' }])
  })

  it('shows an empty state', async () => {
    loginAs()
    mockCategories([])
    renderApp('/categorias')

    expect(await screen.findByText(/Nenhuma categoria criada ainda/)).toBeInTheDocument()
    expect(screen.getByText('Categoria mais utilizada').parentElement).toHaveTextContent('—')
  })
})

describe('Categories page dialogs', () => {
  it('opens the form to create and to edit a category', async () => {
    loginAs()
    mockCategories()
    const { user } = renderApp('/categorias')

    await user.click(await screen.findByRole('button', { name: 'Nova categoria' }))
    expect(await screen.findByRole('dialog', { name: 'Nova categoria' })).toBeInTheDocument()
    await user.keyboard('{Escape}')

    await user.click(await screen.findByRole('button', { name: 'Editar Transporte' }))
    expect(await screen.findByRole('dialog', { name: 'Editar categoria' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('Transporte')
  })
})

describe('Categories page errors', () => {
  it('shows an error when the categories fail to load', async () => {
    loginAs()
    server.use(api.query('Categories', () => HttpResponse.error()))
    renderApp('/categorias')

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar os dados')
  })
})
