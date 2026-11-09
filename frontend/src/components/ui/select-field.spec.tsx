import { screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/render'

import { SelectField } from './select-field'

const options = [
  { value: 'all', label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

function ControlledSelect({ onChange }: { onChange?: (value: string) => void }) {
  const [value, setValue] = useState('all')

  return (
    <SelectField
      label="Tipo"
      options={options}
      value={value}
      onValueChange={(next) => {
        setValue(next)
        onChange?.(next)
      }}
    />
  )
}

describe('SelectField', () => {
  it('shows the selected option', () => {
    renderWithProviders(<ControlledSelect />)

    expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveTextContent('Todos')
  })

  it('selects another option', async () => {
    const onChange = vi.fn()
    const { user } = renderWithProviders(<ControlledSelect onChange={onChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Tipo' }))
    await user.click(await screen.findByRole('option', { name: 'Saída' }))

    expect(onChange).toHaveBeenCalledWith('EXPENSE')
    expect(screen.getByRole('combobox', { name: 'Tipo' })).toHaveTextContent('Saída')
  })

  it('shows the placeholder when there is no value', () => {
    renderWithProviders(<SelectField label="Categoria" options={options} placeholder="Selecione" />)

    expect(screen.getByRole('combobox', { name: 'Categoria' })).toHaveTextContent('Selecione')
  })

  it('shows the error and marks the field as invalid', () => {
    renderWithProviders(<SelectField label="Categoria" options={options} error="Obrigatório" />)

    const select = screen.getByRole('combobox', { name: 'Categoria' })
    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(select).toHaveAccessibleDescription('Obrigatório')
  })
})
