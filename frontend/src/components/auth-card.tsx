import type { ReactNode } from 'react'

import { Card } from '@/components/ui/card'

/** Card of the login and sign up pages. */
export function AuthCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card className="flex flex-col gap-6 p-6 sm:p-8">
      <header className="mb-2 flex flex-col gap-1 text-center">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-base text-gray-600">{description}</p>
      </header>
      {children}
    </Card>
  )
}
