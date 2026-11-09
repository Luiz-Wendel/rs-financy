import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** Summary card of the categories page: icon, big value and an uppercase label. */
export function CategoryStatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value?: ReactNode
  label: string
}) {
  return (
    <Card className="flex items-start gap-4 p-6">
      <span className="flex size-8 shrink-0 items-center justify-center [&_svg]:size-6">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        {value === undefined ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="truncate text-display font-bold text-gray-800">{value}</p>
        )}
        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</p>
      </div>
    </Card>
  )
}
