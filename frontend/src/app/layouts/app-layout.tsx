import type { ReactNode } from 'react'
import { Outlet } from 'react-router'

import { Navbar } from './navbar'

/** Pages of the logged user: navbar and content with 48px gutters. */
export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-12 sm:py-12">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
