/** Page numbers to show: a window of up to `max` pages around the current page. */
export function getPageNumbers(current: number, totalPages: number, max = 5): number[] {
  if (totalPages <= 0) return []

  const size = Math.min(max, totalPages)
  const start = Math.min(Math.max(current - Math.floor(size / 2), 1), totalPages - size + 1)

  return Array.from({ length: size }, (_, index) => start + index)
}

/** Range of items shown in the page, e.g. page 2 of 10 per page with 27 items → 11 a 20. */
export function getPageRange(page: number, perPage: number, total: number) {
  if (total === 0) return { from: 0, to: 0 }

  return { from: (page - 1) * perPage + 1, to: Math.min(page * perPage, total) }
}
