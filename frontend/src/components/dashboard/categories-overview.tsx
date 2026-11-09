import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { paths } from '@/app/paths'
import { SectionCard } from '@/components/ui/section-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tag } from '@/components/ui/tag'
import { TextLink } from '@/components/ui/text-link'
import type { CategoryFieldsFragment } from '@/gql/graphql'
import { getTopCategories } from '@/lib/categories'
import { formatCurrency, formatItemsCount } from '@/lib/format'

export function CategoriesOverview({ categories }: { categories?: CategoryFieldsFragment[] }) {
  return (
    <SectionCard
      title="Categorias"
      action={
        <TextLink asChild>
          <Link to={paths.categories}>
            Gerenciar
            <ChevronRight aria-hidden />
          </Link>
        </TextLink>
      }
    >
      {!categories ? (
        <div className="flex flex-col gap-5 p-6">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-7" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-gray-500">
          Nenhuma categoria criada ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-5 p-6">
          {getTopCategories(categories).map((category) => (
            <li key={category.id} className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <Tag color={category.color} className="max-w-full truncate">
                  {category.title}
                </Tag>
              </div>
              <span className="text-sm whitespace-nowrap text-gray-600">
                {formatItemsCount(category.transactionsCount)}
              </span>
              <span className="min-w-22 text-right text-sm font-semibold whitespace-nowrap text-gray-800">
                {formatCurrency(category.totalAmount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
