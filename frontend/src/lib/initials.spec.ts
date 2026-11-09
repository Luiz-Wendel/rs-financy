import { describe, expect, it } from 'vitest'

import { getInitials } from './initials'

describe('getInitials', () => {
  it('uses the first and last names', () => {
    expect(getInitials('Conta Teste')).toBe('CT')
    expect(getInitials('Maria da Silva Souza')).toBe('MS')
  })

  it('uses a single letter for a single name', () => {
    expect(getInitials('john')).toBe('J')
  })

  it('ignores extra spaces and handles empty names', () => {
    expect(getInitials('  ana   paula ')).toBe('AP')
    expect(getInitials('   ')).toBe('')
  })
})
