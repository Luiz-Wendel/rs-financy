import assert from 'node:assert'

import type { GraphQLFormattedError } from 'graphql'

import type { GraphQLContext } from '../../src/graphql/context.js'
import { createApolloServer } from '../../src/graphql/server.js'
import { prisma } from '../../src/lib/prisma.js'

const server = createApolloServer()

interface ExecuteResult<TData> {
  data?: TData | null
  errors?: readonly GraphQLFormattedError[]
}

/** Runs a GraphQL operation against the schema without going through HTTP. */
export async function executeOperation<TData = Record<string, unknown>>(
  query: string,
  variables?: Record<string, unknown>,
  context: Partial<GraphQLContext> = {},
): Promise<ExecuteResult<TData>> {
  const response = await server.executeOperation<TData>(
    { query, variables },
    { contextValue: { prisma, token: null, ...context } },
  )

  assert(response.body.kind === 'single')

  return response.body.singleResult
}
