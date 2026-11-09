import { ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router'

import { paths } from '@/app/paths'
import { CategoryIcon } from '@/components/categories/category-icon'
import { TransactionAmount } from '@/components/transactions/transaction-amount'
import { SectionCard } from '@/components/ui/section-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'
import { TextLink } from '@/components/ui/text-link'
import type { TransactionFieldsFragment } from '@/gql/graphql'
import { formatShortDate } from '@/lib/format'

interface RecentTransactionsProps {
  transactions?: TransactionFieldsFragment[]
  onNewTransaction: () => void
  className?: string
}

export function RecentTransactions({
  transactions,
  onNewTransaction,
  className,
}: RecentTransactionsProps) {
  return (
    <SectionCard
      className={className}
      title="Transações recentes"
      action={
        <TextLink asChild>
          <Link to={paths.transactions}>
            Ver todas
            <ChevronRight aria-hidden />
          </Link>
        </TextLink>
      }
    >
      {!transactions ? (
        <div className="flex flex-col gap-4 p-6">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-gray-500">
          Nenhuma transação registrada ainda.
        </p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex h-20 items-center gap-4 border-b border-gray-200 px-6"
            >
              <CategoryIcon icon={transaction.category.icon} color={transaction.category.color} />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-base leading-6 text-gray-800">
                  {transaction.description}
                </p>
                <p className="text-sm leading-4 text-gray-600">
                  {formatShortDate(transaction.date)}
                </p>
              </div>
              <div className="hidden w-40 justify-center sm:flex">
                <Tag color={transaction.category.color}>{transaction.category.title}</Tag>
              </div>
              <div className="flex justify-end sm:w-34">
                <TransactionAmount type={transaction.type} amount={transaction.amount} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex h-15 items-center justify-center px-6">
        <TextLink asChild>
          <button type="button" onClick={onNewTransaction}>
            <Plus aria-hidden className="size-4!" />
            Nova transação
          </button>
        </TextLink>
      </div>
    </SectionCard>
  )
}
