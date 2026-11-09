import { afterEach, describe, expect, it } from 'vitest'

import { tokenStorage } from './token-storage'

describe('tokenStorage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('keeps the token in localStorage when remembering the user', () => {
    tokenStorage.set('abc', { remember: true })

    expect(localStorage.getItem('financy:token')).toBe('abc')
    expect(sessionStorage.getItem('financy:token')).toBeNull()
    expect(tokenStorage.get()).toBe('abc')
  })

  it('keeps the token only for the session otherwise', () => {
    tokenStorage.set('abc', { remember: false })

    expect(sessionStorage.getItem('financy:token')).toBe('abc')
    expect(localStorage.getItem('financy:token')).toBeNull()
    expect(tokenStorage.get()).toBe('abc')
  })

  it('replaces a previous token', () => {
    tokenStorage.set('old', { remember: true })
    tokenStorage.set('new', { remember: false })

    expect(localStorage.getItem('financy:token')).toBeNull()
    expect(tokenStorage.get()).toBe('new')
  })

  it('clears the token', () => {
    tokenStorage.set('abc', { remember: true })
    tokenStorage.clear()

    expect(tokenStorage.get()).toBeNull()
  })
})
