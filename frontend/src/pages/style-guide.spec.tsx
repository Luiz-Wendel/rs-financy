import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderApp } from '@/test/render'

describe('Style guide page (development only)', () => {
  it('documents the tokens and components without logging in', async () => {
    renderApp('/style-guide')

    expect(
      await screen.findByRole('heading', { name: 'Style Guide', level: 1 }),
    ).toBeInTheDocument()
    for (const section of [
      'Cores',
      'Tipografia',
      'Botões',
      'Campos',
      'Tags e tipos',
      'Categorias',
      'Outros',
    ]) {
      expect(screen.getByRole('heading', { name: section, level: 2 })).toBeInTheDocument()
    }
    expect(screen.getByText('brand-base')).toBeInTheDocument()
    expect(screen.getByLabelText('Com erro')).toBeInvalid()
    expect(screen.getAllByRole('radio')).toHaveLength(2 + 16 + 7)
  })

  it('has working interactive examples', async () => {
    const { user } = renderApp('/style-guide')

    await user.click(await screen.findByRole('button', { name: 'Página 3' }))
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')

    await user.click(screen.getByRole('button', { name: 'Abrir dialog' }))
    expect(await screen.findByRole('dialog', { name: 'Nova categoria' })).toBeInTheDocument()
  })
})
