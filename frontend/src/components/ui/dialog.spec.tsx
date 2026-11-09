import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { Button } from './button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './dialog'

function ExampleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nova categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader
          title="Nova categoria"
          description="Organize suas transações com categorias"
        />
        <p>Conteúdo</p>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('opens with its title and description', async () => {
    const { user } = renderWithProviders(<ExampleDialog />)

    await user.click(screen.getByRole('button', { name: 'Nova categoria' }))

    const dialog = await screen.findByRole('dialog', { name: 'Nova categoria' })
    expect(dialog).toHaveAccessibleDescription('Organize suas transações com categorias')
  })

  it('closes with the close button', async () => {
    const { user } = renderWithProviders(<ExampleDialog />)

    await user.click(screen.getByRole('button', { name: 'Nova categoria' }))
    await user.click(await screen.findByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes with the Escape key', async () => {
    const { user } = renderWithProviders(<ExampleDialog />)

    await user.click(screen.getByRole('button', { name: 'Nova categoria' }))
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
