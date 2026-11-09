import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { RadioGroup } from 'radix-ui'

import type { TransactionType } from '@/gql/graphql'
import { cn } from '@/lib/utils'

const options = [
  {
    value: 'EXPENSE',
    label: 'Despesa',
    icon: CircleArrowDown,
    checkedClassName: 'border-red-base [&_svg]:text-red-base',
  },
  {
    value: 'INCOME',
    label: 'Receita',
    icon: CircleArrowUp,
    checkedClassName: 'border-green-base [&_svg]:text-green-base',
  },
] as const

/** Expense/income switch at the top of the transaction form. */
export function TransactionTypeToggle({
  value,
  onChange,
}: {
  value: TransactionType
  onChange: (value: TransactionType) => void
}) {
  return (
    <RadioGroup.Root
      aria-label="Tipo da transação"
      value={value}
      onValueChange={(next) => onChange(next as TransactionType)}
      className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-2"
    >
      {options.map(({ value: optionValue, label, icon: Icon, checkedClassName }) => (
        <RadioGroup.Item
          key={optionValue}
          value={optionValue}
          className={cn(
            'flex h-11 items-center justify-center gap-3 rounded-lg border border-transparent text-base text-gray-600 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:text-gray-400',
            'data-[state=checked]:bg-gray-100 data-[state=checked]:font-medium data-[state=checked]:text-gray-800',
            value === optionValue && checkedClassName,
          )}
        >
          <Icon aria-hidden className="size-4" />
          {label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
