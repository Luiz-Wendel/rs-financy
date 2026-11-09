import { CircleArrowDown, CircleArrowUp } from 'lucide-react'

import type { TransactionType } from '@/gql/graphql'
import { formatSignedCurrency } from '@/lib/format'

/** Signed amount followed by the green/red arrow of the transaction type. */
export function TransactionAmount({ type, amount }: { type: TransactionType; amount: number }) {
  const Icon = type === 'INCOME' ? CircleArrowUp : CircleArrowDown

  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-gray-800">
      {formatSignedCurrency(type, amount)}
      <Icon
        aria-label={type === 'INCOME' ? 'Entrada' : 'Saída'}
        className={type === 'INCOME' ? 'size-4 text-green-base' : 'size-4 text-red-base'}
      />
    </span>
  )
}
