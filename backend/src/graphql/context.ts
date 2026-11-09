import type { IncomingHttpHeaders } from 'node:http'

import { verifyToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'
import { unauthenticatedError } from './errors.js'

export interface GraphQLContext {
  prisma: typeof prisma
  /** Id of the logged user, taken from a valid JWT. Null for anonymous requests. */
  userId: string | null
}

export function getBearerToken(headers: IncomingHttpHeaders): string | null {
  const [scheme, token] = headers.authorization?.split(' ') ?? []

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token
}

export async function buildContext({
  req,
}: {
  req: { headers: IncomingHttpHeaders }
}): Promise<GraphQLContext> {
  const token = getBearerToken(req.headers)

  return {
    prisma,
    userId: token ? verifyToken(token) : null,
  }
}

/** Returns the logged user id or throws UNAUTHENTICATED. */
export function requireAuth(context: GraphQLContext): string {
  if (!context.userId) {
    throw unauthenticatedError()
  }

  return context.userId
}
