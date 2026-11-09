import { useMutation, useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { CategoriesQuery } from '@/api/categories'
import { DeleteTransactionMutation, TransactionsQuery } from '@/api/transactions'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageHeader } from '@/components/page-header'
import {
  ALL,
  TransactionFilters,
  type TransactionFiltersValue,
} from '@/components/transactions/transaction-filters'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import type { TransactionFieldsFragment, TransactionType } from '@/gql/graphql'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { invalidateFinanceData } from '@/lib/cache'
import { getErrorMessage } from '@/lib/errors'
import { getCurrentPeriod, periodToValue, valueToPeriod } from '@/lib/period'

const PER_PAGE = 10

function toApiFilter(filters: TransactionFiltersValue, search: string) {
  return {
    search: search.trim() || null,
    type: filters.type === ALL ? null : (filters.type as TransactionType),
    categoryId: filters.categoryId === ALL ? null : filters.categoryId,
    period: filters.period === ALL ? null : valueToPeriod(filters.period),
  }
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFiltersValue>(() => ({
    search: '',
    type: ALL,
    categoryId: ALL,
    period: periodToValue(getCurrentPeriod()),
  }))
  const [page, setPage] = useState(1)
  const search = useDebouncedValue(filters.search)
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionFieldsFragment>()
  // The transaction dialog (create/edit) is added with the "Nova transação" form
  const [, setTransactionToEdit] = useState<TransactionFieldsFragment | 'new'>()

  const { data, previousData } = useQuery(TransactionsQuery, {
    variables: { filter: toApiFilter(filters, search), page, perPage: PER_PAGE },
  })
  const { data: categoriesData } = useQuery(CategoriesQuery)
  const [deleteTransaction, { loading: isDeleting }] = useMutation(DeleteTransactionMutation, {
    update: invalidateFinanceData,
  })

  // Keep showing the previous page while the next one loads
  const result = (data ?? previousData)?.transactions

  function handleFiltersChange(value: TransactionFiltersValue) {
    setFilters(value)
    setPage(1)
  }

  async function handleDelete() {
    if (!transactionToDelete) return

    try {
      await deleteTransaction({ variables: { id: transactionToDelete.id } })
      toast.success('Transação excluída')
      setTransactionToDelete(undefined)
      // The last item of a page was removed: go back one page
      if (result && result.items.length === 1 && page > 1) setPage(page - 1)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        action={
          <Button size="sm" onClick={() => setTransactionToEdit('new')}>
            <Plus aria-hidden />
            Nova transação
          </Button>
        }
      />

      <TransactionFilters
        value={filters}
        onChange={handleFiltersChange}
        categories={categoriesData?.categories ?? []}
      />

      <Card className="overflow-hidden">
        <TransactionsTable
          transactions={result?.items}
          onEdit={setTransactionToEdit}
          onDelete={setTransactionToDelete}
        />
        <Pagination
          className="h-18 px-6"
          page={result?.page ?? page}
          perPage={result?.perPage ?? PER_PAGE}
          total={result?.total ?? 0}
          totalPages={result?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </Card>

      <ConfirmDialog
        open={Boolean(transactionToDelete)}
        onOpenChange={(open) => !open && setTransactionToDelete(undefined)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${transactionToDelete?.description}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  )
}
