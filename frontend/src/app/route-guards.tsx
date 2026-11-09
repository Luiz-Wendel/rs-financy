import { Navigate, Outlet } from 'react-router'

import { FullScreenLoader } from '@/components/full-screen-loader'
import { useAuth } from '@/lib/auth/use-auth'
import { DashboardPage } from '@/pages/dashboard'
import { LoginPage } from '@/pages/login'

import { AppLayout } from './layouts/app-layout'
import { AuthLayout } from './layouts/auth-layout'
import { paths } from './paths'

/** "/" shows the login when logged out and the dashboard when logged in. */
export function HomeRoute() {
  const { status } = useAuth()

  if (status === 'loading') return <FullScreenLoader />

  return status === 'authenticated' ? (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  ) : (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  )
}

export function PrivateRoute() {
  const { status } = useAuth()

  if (status === 'loading') return <FullScreenLoader />

  return status === 'authenticated' ? <Outlet /> : <Navigate to={paths.home} replace />
}

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') return <FullScreenLoader />

  return status === 'authenticated' ? <Navigate to={paths.home} replace /> : <Outlet />
}
