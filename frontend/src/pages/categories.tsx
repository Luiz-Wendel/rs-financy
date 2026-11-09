import { useMutation, useQuery } from '@apollo/client/react'
import { ArrowUpDown, Plus, Tag } from 'lucide-react'
import { createElement, useState } from 'react'
import { toast } from 'sonner'

import { CategoriesQuery, DeleteCategoryMutation } from '@/api/categories'
import { CategoryCard } from '@/components/categories/category-card'
import { CategoryDialog } from '@/components/categories/category-dialog'
import { CategoryStatCard } from '@/components/categories/category-stat-card'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PageHeader } from '@/components/page-header'
import { PageTitle } from '@/components/page-title'
import { QueryError } from '@/components/query-error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategoryFieldsFragment } from '@/gql/graphql'
import { invalidateFinanceData } from '@/lib/cache'
import { getCategoryColorClasses } from '@/lib/category-colors'
import { getCategoryIcon } from '@/lib/category-icons'
import { getMostUsedCategory } from '@/lib/categories'
import { getErrorMessage } from '@/lib/errors'

function deleteDescription(category?: CategoryFieldsFragment) {
  if (!category) return ''

  const count = category.transactionsCount
  const transactions =
    count === 0
      ? ''
      : count === 1
        ? ' A transação desta categoria também será excluída.'
        : ` As ${count} transações desta categoria também serão excluídas.`

  return `Tem certeza que deseja excluir "${category.title}"?${transactions}`
}

export function CategoriesPage() {
  const { data, error, refetch } = useQuery(CategoriesQuery)
  const categories = data?.categories
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryFieldsFragment>()
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryFieldsFragment | 'new'>()
  const [deleteCategory, { loading: isDeleting }] = useMutation(DeleteCategoryMutation, {
    update: invalidateFinanceData,
  })

  const totalTransactions = categories?.reduce(
    (total, category) => total + category.transactionsCount,
    0,
  )
  const mostUsed = categories && getMostUsedCategory(categories)

  async function handleDelete() {
    if (!categoryToDelete) return

    try {
      await deleteCategory({ variables: { id: categoryToDelete.id } })
      toast.success('Categoria excluída')
      setCategoryToDelete(undefined)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageTitle>Categorias</PageTitle>
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        action={
          <Button size="sm" onClick={() => setCategoryToEdit('new')}>
            <Plus aria-hidden />
            Nova categoria
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-3">
        <CategoryStatCard
          icon={<Tag aria-hidden className="text-gray-700" />}
          value={categories?.length}
          label="Total de categorias"
        />
        <CategoryStatCard
          icon={<ArrowUpDown aria-hidden className="text-purple-base" />}
          value={totalTransactions}
          label="Total de transações"
        />
        <CategoryStatCard
          icon={
            mostUsed ? (
              <span className={getCategoryColorClasses(mostUsed.color).text}>
                {createElement(getCategoryIcon(mostUsed.icon), { 'aria-hidden': true })}
              </span>
            ) : (
              <Tag aria-hidden className="text-gray-400" />
            )
          }
          value={categories ? (mostUsed?.title ?? '—') : undefined}
          label="Categoria mais utilizada"
        />
      </section>

      {error && !categories ? (
        <QueryError error={error} onRetry={() => void refetch()} />
      ) : !categories ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </section>
      ) : categories.length === 0 ? (
        <Card className="px-6 py-12 text-center text-sm text-gray-500">
          Nenhuma categoria criada ainda. Crie a primeira para organizar suas transações.
        </Card>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={setCategoryToEdit}
              onDelete={setCategoryToDelete}
            />
          ))}
        </section>
      )}

      <CategoryDialog
        open={Boolean(categoryToEdit)}
        onOpenChange={(open) => !open && setCategoryToEdit(undefined)}
        category={categoryToEdit === 'new' ? undefined : categoryToEdit}
      />

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(undefined)}
        title="Excluir categoria"
        description={deleteDescription(categoryToDelete)}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />
    </div>
  )
}
