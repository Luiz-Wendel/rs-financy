import { useApolloClient, useQuery } from '@apollo/client/react'
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { MeQuery } from '@/api/auth'

import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'
import { onSessionExpired } from './session-events'
import { tokenStorage } from './token-storage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [token, setToken] = useState(() => tokenStorage.get())
  const { data, error } = useQuery(MeQuery, { skip: !token })

  const signOut = useCallback(() => {
    tokenStorage.clear()
    setToken(null)
    void client.clearStore()
  }, [client])

  const signIn = useCallback<AuthContextValue['signIn']>(
    ({ token, user }, { remember = true } = {}) => {
      tokenStorage.set(token, { remember })
      // Seed the cache so the session starts without fetching `me` again
      client.writeQuery({ query: MeQuery, data: { __typename: 'Query', me: user } })
      setToken(token)
    },
    [client],
  )

  useEffect(() => onSessionExpired(signOut), [signOut])

  const user = token ? (data?.me ?? null) : null
  const status: AuthStatus = !token
    ? 'unauthenticated'
    : user
      ? 'authenticated'
      : error
        ? 'unauthenticated'
        : 'loading'

  const value = useMemo(() => ({ user, status, signIn, signOut }), [user, status, signIn, signOut])

  return <AuthContext value={value}>{children}</AuthContext>
}
