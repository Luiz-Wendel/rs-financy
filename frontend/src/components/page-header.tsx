import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-base text-gray-600">{description}</p>
      </div>
      {action}
    </header>
  )
}
