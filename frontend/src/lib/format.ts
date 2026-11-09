const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 1284732 → "R$ 12.847,32" (amounts come from the API in cents). */
export function formatCurrency(cents: number) {
  // Intl uses a non-breaking space after "R$"; a regular space keeps texts searchable.
  return currencyFormatter.format(cents / 100).replace(/\s/u, ' ')
}

/** Adds the sign of the transaction type: "+ R$ 4.250,00" or "- R$ 89,50". */
export function formatSignedCurrency(type: 'INCOME' | 'EXPENSE', cents: number) {
  return `${type === 'INCOME' ? '+' : '-'} ${formatCurrency(cents)}`
}

/** "2026-11-30" → "30/11/26" (dates come from the API without time). */
export function formatShortDate(date: string) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year?.slice(2)}`
}

/** 1 → "1 item", 12 → "12 itens" */
export function formatItemsCount(count: number) {
  return `${count} ${count === 1 ? 'item' : 'itens'}`
}
