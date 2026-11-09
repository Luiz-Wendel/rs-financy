import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** White surface with the light border and 12px radius used by every section of the layout. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-xl border border-gray-200 bg-white', className)} {...props} />
}
