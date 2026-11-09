import { SquarePen, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import type { CategoryFieldsFragment } from '@/gql/graphql'
import { formatItemsCount } from '@/lib/format'

import { CategoryIcon } from './category-icon'

interface CategoryCardProps {
  category: CategoryFieldsFragment
  onEdit: (category: CategoryFieldsFragment) => void
  onDelete: (category: CategoryFieldsFragment) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <CategoryIcon icon={category.icon} color={category.color} />
        <div className="flex gap-2">
          <Button
            variant="danger"
            size="icon"
            aria-label={`Excluir ${category.title}`}
            onClick={() => onDelete(category)}
          >
            <Trash />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Editar ${category.title}`}
            onClick={() => onEdit(category)}
          >
            <SquarePen />
          </Button>
        </div>
      </div>

      <h2 className="mt-5 truncate text-base font-semibold text-gray-800">{category.title}</h2>
      <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-600">{category.description}</p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Tag color={category.color} className="min-w-0 truncate">
          {category.title}
        </Tag>
        <span className="text-sm whitespace-nowrap text-gray-600">
          {formatItemsCount(category.transactionsCount)}
        </span>
      </div>
    </Card>
  )
}
