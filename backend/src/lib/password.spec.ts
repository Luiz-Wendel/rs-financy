import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password.js'

describe('password', () => {
  it('hashes the password without storing it in plain text', async () => {
    const hash = await hashPassword('my-secret-password')

    expect(hash).not.toBe('my-secret-password')
    expect(hash).toMatch(/^\$2[aby]\$/)
  })

  it('verifies the right password', async () => {
    const hash = await hashPassword('my-secret-password')

    await expect(verifyPassword('my-secret-password', hash)).resolves.toBe(true)
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false)
  })
})
