import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    const isHidden = false

    expect(cn('px-2', isHidden && 'hidden', undefined, 'py-1')).toBe('px-2 py-1')
  })

  it('lets later Tailwind classes override conflicting ones', () => {
    expect(cn('px-2 text-sm', 'px-4')).toBe('text-sm px-4')
  })
})
