import { Link, NavLink } from 'react-router'

import { paths } from '@/app/paths'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth/use-auth'
import { cn } from '@/lib/utils'

const links = [
  { to: paths.home, label: 'Dashboard' },
  { to: paths.transactions, label: 'Transações' },
  { to: paths.categories, label: 'Categorias' },
]

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-12">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4">
        <Link to={paths.home} aria-label="Ir para o dashboard" className="shrink-0">
          {/* Small screens only have room for the symbol */}
          <Logo variant="icon" className="size-8 sm:hidden" />
          <Logo className="hidden h-6 sm:block" />
        </Link>

        <nav
          aria-label="Principal"
          className="flex items-center gap-3 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:gap-5"
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'text-sm transition-colors',
                  isActive ? 'font-semibold text-brand-base' : 'text-gray-600 hover:text-gray-800',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Link
          to={paths.profile}
          aria-label="Meu perfil"
          className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Avatar name={user?.name ?? ''} />
        </Link>
      </div>
    </header>
  )
}
