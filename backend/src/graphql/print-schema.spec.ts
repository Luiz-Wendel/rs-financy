import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { printApiSchema } from './print-schema.js'

describe('schema.graphql', () => {
  it('is up to date with the typeDefs (run `npm run schema:print`)', () => {
    expect(readFileSync('schema.graphql', 'utf8')).toBe(printApiSchema())
  })
})
