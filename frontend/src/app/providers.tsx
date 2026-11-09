import { ApolloProvider } from '@apollo/client/react'
import { type ReactNode, useState } from 'react'

import { createApolloClient } from '@/lib/apollo'
import { AuthProvider } from '@/lib/auth/auth-provider'
import { notifySessionExpired } from '@/lib/auth/session-events'
import { tokenStorage } from '@/lib/auth/token-storage'

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() =>
    createApolloClient({ getToken: tokenStorage.get, onUnauthenticated: notifySessionExpired }),
  )

  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  )
}
