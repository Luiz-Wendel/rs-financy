import { graphql } from 'msw/graphql'
import { setupServer } from 'msw/node'

import { env } from '@/env'

/** Scopes GraphQL handlers to the API endpoint. */
export const api = graphql.link(env.VITE_BACKEND_URL)

/** Handlers shared by every test. Tests add their own with `server.use(...)`. */
export const server = setupServer()
