export interface Period {
  year: number
  /** 1 (January) to 12 (December) */
  month: number
}

/** Current month in the user's timezone, as expected by the API. */
export function getCurrentPeriod(now = new Date()): Period {
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

/** { year: 2025, month: 11 } → "Novembro / 2025" */
export function formatPeriod({ year, month }: Period) {
  const name = monthFormatter.format(new Date(year, month - 1, 1))
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} / ${year}`
}

/** "2025-11" ⇄ { year: 2025, month: 11 } (values for selects) */
export function periodToValue({ year, month }: Period) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function valueToPeriod(value: string): Period {
  const [year, month] = value.split('-').map(Number)
  return { year: year!, month: month! }
}

/** The `count` most recent months, starting with the current one. */
export function getRecentPeriods(count = 12, now = new Date()): Period[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    return { year: date.getFullYear(), month: date.getMonth() + 1 }
  })
}
