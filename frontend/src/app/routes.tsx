import { Navigate, type RouteObject } from 'react-router'

import { CategoriesPage } from '@/pages/categories'
import { ProfilePage } from '@/pages/profile'
import { SignUpPage } from '@/pages/sign-up'
import { TransactionsPage } from '@/pages/transactions'

import { AppLayout } from './layouts/app-layout'
import { AuthLayout } from './layouts/auth-layout'
import { paths } from './paths'
import { HomeRoute, PrivateRoute, PublicOnlyRoute } from './route-guards'

export const routes: RouteObject[] = [
  { path: paths.home, element: <HomeRoute /> },
  {
    element: <PublicOnlyRoute />,
    children: [
      { element: <AuthLayout />, children: [{ path: paths.signUp, element: <SignUpPage /> }] },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: paths.transactions, element: <TransactionsPage /> },
          { path: paths.categories, element: <CategoriesPage /> },
          { path: paths.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={paths.home} replace /> },
]
