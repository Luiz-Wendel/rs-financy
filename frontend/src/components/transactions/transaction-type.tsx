import { CircleArrowDown, CircleArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TransactionType = 'INCOME' | 'EXPENSE'

const types = {
  INCOME: { label: 'Entrada', icon: CircleArrowUp, className: 'text-green-base' },
  EXPENSE: { label: 'Saída', icon: CircleArrowDown, className: 'text-red-base' },
} as const

/** "Type" from the Figma Style Guide: green "Entrada" or red "Saída" with an arrow. */
export function TransactionTypeIndicator({
  type,
  className,
}: {
  type: TransactionType
  className?: string
}) {
  const { label, icon: Icon, className: colorClassName } = types[type]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-medium',
        colorClassName,
        className,
      )}
    >
      <Icon aria-hidden className="size-4" />
      {label}
    </span>
  )
}
