import { Search } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { SelectField } from '@/components/ui/select-field'
import { TextField } from '@/components/ui/text-field'
import type { CategoryBaseFieldsFragment } from '@/gql/graphql'
import { formatPeriod, getRecentPeriods, periodToValue } from '@/lib/period'

export const ALL = 'all'

export interface TransactionFiltersValue {
  search: string
  /** INCOME, EXPENSE or "all" */
  type: string
  /** Category id or "all" */
  categoryId: string
  /** "2025-11" or "all" */
  period: string
}

const typeOptions = [
  { value: ALL, label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

const periodOptions = [
  { value: ALL, label: 'Todos os períodos' },
  ...getRecentPeriods().map((period) => ({
    value: periodToValue(period),
    label: formatPeriod(period),
  })),
]

interface TransactionFiltersProps {
  value: TransactionFiltersValue
  onChange: (value: TransactionFiltersValue) => void
  categories: CategoryBaseFieldsFragment[]
}

export function TransactionFilters({ value, onChange, categories }: TransactionFiltersProps) {
  const categoryOptions = [
    { value: ALL, label: 'Todas' },
    ...categories.map((category) => ({ value: category.id, label: category.title })),
  ]

  function update(changes: Partial<TransactionFiltersValue>) {
    onChange({ ...value, ...changes })
  }

  return (
    <Card className="grid gap-4 px-6 pt-5 pb-6 sm:grid-cols-2 lg:grid-cols-4">
      <TextField
        label="Buscar"
        icon={Search}
        type="search"
        placeholder="Buscar por descrição"
        value={value.search}
        onChange={(event) => update({ search: event.target.value })}
      />
      <SelectField
        label="Tipo"
        options={typeOptions}
        value={value.type}
        onValueChange={(type) => update({ type })}
      />
      <SelectField
        label="Categoria"
        options={categoryOptions}
        value={value.categoryId}
        onValueChange={(categoryId) => update({ categoryId })}
      />
      <SelectField
        label="Período"
        options={periodOptions}
        value={value.period}
        onValueChange={(period) => update({ period })}
      />
    </Card>
  )
}
