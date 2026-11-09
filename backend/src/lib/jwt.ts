import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from '../config/env.js'

export function signToken(userId: string) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

/** Returns the user id stored in the token, or null when it is invalid or expired. */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    return typeof payload === 'object' && payload.sub ? payload.sub : null
  } catch {
    return null
  }
}
