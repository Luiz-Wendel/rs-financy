import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'

import { env } from '@/env'

interface CreateApolloClientOptions {
  /** Returns the current session token, if any */
  getToken: () => string | null
  /** Called when the API rejects the session (invalid or expired token) */
  onUnauthenticated: () => void
}

/** Operations whose UNAUTHENTICATED error means wrong credentials, not an expired session. */
const PUBLIC_OPERATIONS = new Set(['Login', 'Register'])

export function createApolloClient({ getToken, onUnauthenticated }: CreateApolloClientOptions) {
  const authLink = new SetContextLink((prevContext) => {
    const token = getToken()

    return token ? { headers: { ...prevContext.headers, authorization: `Bearer ${token}` } } : {}
  })

  const errorLink = new ErrorLink(({ error, operation }) => {
    const isSessionError =
      CombinedGraphQLErrors.is(error) &&
      error.errors.some((graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED')

    if (isSessionError && !PUBLIC_OPERATIONS.has(operation.operationName ?? '')) {
      onUnauthenticated()
    }
  })

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, new HttpLink({ uri: env.VITE_BACKEND_URL })]),
    cache: new InMemoryCache(),
  })
}
