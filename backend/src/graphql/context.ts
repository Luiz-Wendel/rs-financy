import type { IncomingHttpHeaders } from 'node:http'

import { prisma } from '../lib/prisma.js'

export interface GraphQLContext {
  prisma: typeof prisma
  /** Raw JWT sent in the `Authorization: Bearer <token>` header */
  token: string | null
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
  return {
    prisma,
    token: getBearerToken(req.headers),
  }
}
