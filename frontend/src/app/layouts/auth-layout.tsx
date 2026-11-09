import type { ReactNode } from 'react'
import { Outlet } from 'react-router'

import { Logo } from '@/components/logo'

/** Public pages (login and sign up): logo on top of a centered card. */
export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center gap-8 px-4 py-12">
      <Logo />
      <div className="w-full max-w-112">{children ?? <Outlet />}</div>
    </main>
  )
}
