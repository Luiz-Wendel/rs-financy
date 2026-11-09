import { screen } from '@testing-library/react'
import { Mail } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { PasswordField } from './password-field'
import { TextField } from './text-field'

describe('TextField', () => {
  it('associates the label with the input', async () => {
    const { user } = renderWithProviders(
      <TextField label="E-mail" icon={Mail} placeholder="mail@exemplo.com" />,
    )

    const input = screen.getByLabelText('E-mail')
    await user.type(input, 'john@example.com')

    expect(input).toHaveValue('john@example.com')
    expect(input).toHaveAttribute('placeholder', 'mail@exemplo.com')
  })

  it('shows the helper text linked to the input', () => {
    renderWithProviders(<TextField label="E-mail" helper="O e-mail não pode ser alterado" />)

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'O e-mail não pode ser alterado',
    )
  })

  it('shows the error instead of the helper and marks the input as invalid', () => {
    renderWithProviders(<TextField label="E-mail" helper="Ajuda" error="E-mail inválido" />)

    const input = screen.getByLabelText('E-mail')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('E-mail inválido')
    expect(screen.queryByText('Ajuda')).not.toBeInTheDocument()
  })

  it('disables the input', () => {
    renderWithProviders(<TextField label="E-mail" disabled />)

    expect(screen.getByLabelText('E-mail')).toBeDisabled()
  })
})

describe('PasswordField', () => {
  it('hides the password by default and toggles its visibility', async () => {
    const { user } = renderWithProviders(<PasswordField label="Senha" />)
    const input = screen.getByLabelText('Senha')

    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(input).toHaveAttribute('type', 'password')
  })
})
