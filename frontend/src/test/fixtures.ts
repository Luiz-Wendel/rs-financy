/** Data in the shape returned by the API (with __typename, as Apollo expects). */

export function makeCategory(overrides: Partial<ReturnType<typeof baseCategory>> = {}) {
  return { ...baseCategory(), ...overrides }
}

function baseCategory() {
  return {
    __typename: 'Category' as const,
    id: 'category-1',
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições' as string | null,
    icon: 'utensils',
    color: 'blue',
    transactionsCount: 12,
    totalAmount: 54230,
  }
}

export function makeTransaction(overrides: Partial<ReturnType<typeof baseTransaction>> = {}) {
  return { ...baseTransaction(), ...overrides }
}

function baseTransaction() {
  return {
    __typename: 'Transaction' as const,
    id: 'transaction-1',
    description: 'Jantar no Restaurante',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    amount: 8950,
    date: '2025-11-30',
    category: makeCategory(),
  }
}
