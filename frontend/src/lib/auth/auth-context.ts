import { createContext } from 'react'

import type { UserFieldsFragment } from '@/gql/graphql'

export type AuthUser = UserFieldsFragment

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  /** Starts a session with the payload returned by the login/register mutations */
  signIn: (session: { token: string; user: AuthUser }, options?: { remember?: boolean }) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
