import bcrypt from 'bcryptjs'

import { env } from '../config/env.js'

// Fewer rounds in tests keep the suite fast; production uses a safe cost.
const SALT_ROUNDS = env.NODE_ENV === 'test' ? 4 : 10

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
