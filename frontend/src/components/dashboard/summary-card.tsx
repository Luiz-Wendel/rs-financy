import type { LucideIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  icon: LucideIcon
  iconClassName: string
  label: string
  /** Value in cents; undefined while loading */
  value?: number
}

export function SummaryCard({ icon: Icon, iconClassName, label, value }: SummaryCardProps) {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="flex items-center gap-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
        <Icon aria-hidden className={cn('size-5', iconClassName)} />
        {label}
      </p>
      {value === undefined ? (
        <Skeleton className="h-8 w-48" />
      ) : (
        <p className="text-display font-bold text-gray-800">{formatCurrency(value)}</p>
      )}
    </Card>
  )
}
