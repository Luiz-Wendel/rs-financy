import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getPageNumbers, getPageRange } from '@/lib/pagination'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  perPage: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const pageButtonClasses =
  'inline-flex size-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition-colors outline-none hover:bg-gray-200 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4'

/** Results summary and "Pagination Button"s from the Figma Style Guide. */
export function Pagination({
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const { from, to } = getPageRange(page, perPage, total)
  const pages = getPageNumbers(page, totalPages)

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <p className="text-sm text-gray-700">
        <span className="font-medium">
          {from} a {to}
        </span>{' '}
        <span className="text-gray-300">|</span> {total} {total === 1 ? 'resultado' : 'resultados'}
      </p>

      {totalPages > 0 && (
        <nav aria-label="Paginação" className="flex items-center gap-2">
          <button
            type="button"
            className={pageButtonClasses}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft aria-hidden />
          </button>

          {pages.map((pageNumber) => {
            const isCurrent = pageNumber === page

            return (
              <button
                key={pageNumber}
                type="button"
                className={cn(
                  pageButtonClasses,
                  isCurrent && 'border-brand-base bg-brand-base text-white hover:bg-brand-base',
                )}
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Página ${pageNumber}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          })}

          <button
            type="button"
            className={pageButtonClasses}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight aria-hidden />
          </button>
        </nav>
      )}
    </div>
  )
}
