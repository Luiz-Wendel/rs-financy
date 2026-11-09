import { createElement } from 'react'

import { getCategoryColorClasses } from '@/lib/category-colors'
import { getCategoryIcon } from '@/lib/category-icons'
import { cn } from '@/lib/utils'

/** Category icon inside a light colored square (40px). */
export function CategoryIcon({
  icon,
  color,
  className,
}: {
  icon: string
  color: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
        getCategoryColorClasses(color).icon,
        className,
      )}
    >
      {createElement(getCategoryIcon(icon), { 'aria-hidden': true, className: 'size-4' })}
    </span>
  )
}
