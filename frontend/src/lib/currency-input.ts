/** Up to R$ 1.000.000,00, the limit accepted by the API */
export const MAX_AMOUNT_IN_CENTS = 100_000_000

/** Reads the typed digits as cents: "1.234,5" + "6" → 123456 (like a cash register). */
export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return Math.min(Number(digits || 0), MAX_AMOUNT_IN_CENTS)
}

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 123456 → "1.234,56" (without the currency symbol) */
export function formatCurrencyInput(cents: number): string {
  return numberFormatter.format(cents / 100)
}
