import { SquarePen, Trash } from 'lucide-react'

import { CategoryIcon } from '@/components/categories/category-icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'
import type { TransactionFieldsFragment } from '@/gql/graphql'
import { formatShortDate, formatSignedCurrency } from '@/lib/format'

import { TransactionTypeIndicator } from './transaction-type'

interface TransactionsTableProps {
  transactions?: TransactionFieldsFragment[]
  onEdit: (transaction: TransactionFieldsFragment) => void
  onDelete: (transaction: TransactionFieldsFragment) => void
}

const headerClasses = 'h-14 px-6 text-xs font-medium tracking-wider text-gray-500 uppercase'

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-240 table-fixed border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className={`${headerClasses} text-left`}>Descrição</th>
            <th className={`${headerClasses} w-28 text-center`}>Data</th>
            <th className={`${headerClasses} w-50 text-center`}>Categoria</th>
            <th className={`${headerClasses} w-34 text-center`}>Tipo</th>
            <th className={`${headerClasses} w-50 text-right`}>Valor</th>
            <th className={`${headerClasses} w-30 text-right`}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {!transactions ? (
            Array.from({ length: 5 }, (_, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td colSpan={6} className="h-18 px-6">
                  <Skeleton className="h-10" />
                </td>
              </tr>
            ))
          ) : transactions.length === 0 ? (
            <tr className="border-b border-gray-200">
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                Nenhuma transação encontrada.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="h-18 border-b border-gray-200">
                <td className="px-6">
                  <div className="flex items-center gap-4">
                    <CategoryIcon
                      icon={transaction.category.icon}
                      color={transaction.category.color}
                    />
                    <span className="truncate text-base font-medium text-gray-800">
                      {transaction.description}
                    </span>
                  </div>
                </td>
                <td className="px-6 text-center text-sm whitespace-nowrap text-gray-600">
                  {formatShortDate(transaction.date)}
                </td>
                <td className="px-6 text-center">
                  <Tag color={transaction.category.color} className="max-w-full truncate">
                    {transaction.category.title}
                  </Tag>
                </td>
                <td className="px-6 text-center">
                  <TransactionTypeIndicator type={transaction.type} className="align-middle" />
                </td>
                <td className="px-6 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
                  {formatSignedCurrency(transaction.type, transaction.amount)}
                </td>
                <td className="px-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="danger"
                      size="icon"
                      aria-label={`Excluir ${transaction.description}`}
                      onClick={() => onDelete(transaction)}
                    >
                      <Trash />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Editar ${transaction.description}`}
                      onClick={() => onEdit(transaction)}
                    >
                      <SquarePen />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
