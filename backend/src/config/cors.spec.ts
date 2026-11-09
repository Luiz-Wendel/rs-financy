import { describe, expect, it } from 'vitest'

import { buildCorsOptions, parseCorsOrigin, parseList } from './cors.js'

describe('parseList', () => {
  it('splits a comma-separated list ignoring spaces and empty items', () => {
    expect(parseList(' GET, POST,,OPTIONS ')).toEqual(['GET', 'POST', 'OPTIONS'])
  })
})

describe('parseCorsOrigin', () => {
  it('splits a comma-separated list of origins', () => {
    expect(parseCorsOrigin('http://localhost:5173, https://financy.app')).toEqual([
      'http://localhost:5173',
      'https://financy.app',
    ])
  })

  it('allows any origin when "*" is present', () => {
    expect(parseCorsOrigin('*')).toBe(true)
  })
})

describe('buildCorsOptions', () => {
  it('builds the options for the cors middleware', () => {
    expect(
      buildCorsOptions({
        origin: 'http://localhost:5173',
        methods: 'get, post ,options',
        credentials: true,
      }),
    ).toEqual({
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    })
  })
})
