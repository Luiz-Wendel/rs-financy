import type { ApolloCache } from '@apollo/client'

/**
 * After creating, editing or deleting transactions/categories, totals and lists change in
 * several places (dashboard, transactions, categories). Evicting the root fields makes every
 * active query refetch and the inactive ones load fresh data next time.
 */
export function invalidateFinanceData(cache: ApolloCache) {
  for (const fieldName of ['transactions', 'summary', 'categories']) {
    cache.evict({ id: 'ROOT_QUERY', fieldName })
  }
  cache.gc()
}
