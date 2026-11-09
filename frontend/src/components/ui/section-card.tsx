import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Card } from './card'

/** Card with an uppercase title and an optional action on the right (dashboard sections). */
export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <header className="flex h-15 items-center justify-between gap-4 border-b border-gray-200 px-6">
        <h2 className="text-xs font-medium tracking-wider text-gray-500 uppercase">{title}</h2>
        {action}
      </header>
      {children}
    </Card>
  )
}
