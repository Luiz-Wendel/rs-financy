import type { ComponentProps } from 'react'

import { getCategoryColorClasses } from '@/lib/category-colors'
import { cn } from '@/lib/utils'

interface TagProps extends ComponentProps<'span'> {
  /** Category color (green, blue, ...). Unknown or missing colors render the gray tag. */
  color?: string
}

/** "Tag" from the Figma Style Guide, used for category names. */
export function Tag({ color = '', className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap',
        getCategoryColorClasses(color).tag,
        className,
      )}
      {...props}
    />
  )
}
