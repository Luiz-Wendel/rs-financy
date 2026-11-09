import type { CategoryFieldsFragment } from '@/gql/graphql'

/** Most used categories first (ties by title), limited to `limit` items. */
export function getTopCategories(categories: CategoryFieldsFragment[], limit = 5) {
  return [...categories]
    .sort(
      (a, b) =>
        b.transactionsCount - a.transactionsCount || a.title.localeCompare(b.title, 'pt-BR'),
    )
    .slice(0, limit)
}

/** Category with the most transactions, or undefined when no category has transactions. */
export function getMostUsedCategory(categories: CategoryFieldsFragment[]) {
  const [first] = getTopCategories(categories, 1)
  return first && first.transactionsCount > 0 ? first : undefined
}
