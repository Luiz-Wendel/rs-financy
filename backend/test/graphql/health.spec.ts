import { describe, expect, it } from 'vitest'

import { executeOperation } from '../helpers/graphql.js'

describe('health query', () => {
  it('returns ok', async () => {
    const result = await executeOperation<{ health: string }>('query { health }')

    expect(result.errors).toBeUndefined()
    expect(result.data?.health).toBe('ok')
  })
})
