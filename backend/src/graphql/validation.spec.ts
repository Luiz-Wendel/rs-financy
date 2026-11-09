import { GraphQLError } from 'graphql'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ErrorCode } from './errors.js'
import { validateInput } from './validation.js'

const schema = z.object({
  email: z.email(),
  name: z.string().trim().min(1),
})

describe('validateInput', () => {
  it('returns the parsed data', () => {
    expect(validateInput(schema, { email: 'john@example.com', name: '  John ' })).toEqual({
      email: 'john@example.com',
      name: 'John',
    })
  })

  it('throws BAD_USER_INPUT with the invalid fields', () => {
    try {
      validateInput(schema, { email: 'not-an-email', name: '' })
      expect.unreachable()
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError)
      const { extensions } = error as GraphQLError
      expect(extensions.code).toBe(ErrorCode.BAD_USER_INPUT)
      expect(Object.keys(extensions.fieldErrors as object)).toEqual(['email', 'name'])
    }
  })
})
