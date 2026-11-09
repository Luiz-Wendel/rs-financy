import { GraphQLError } from 'graphql'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  badUserInputError,
  conflictError,
  ErrorCode,
  formatError,
  notFoundError,
  unauthenticatedError,
} from './errors.js'

describe('error factories', () => {
  it('creates errors with the expected codes', () => {
    expect(unauthenticatedError().extensions.code).toBe(ErrorCode.UNAUTHENTICATED)
    expect(notFoundError('Category').message).toBe('Category not found')
    expect(notFoundError('Category').extensions.code).toBe(ErrorCode.NOT_FOUND)
    expect(conflictError('Email already in use').extensions.code).toBe(ErrorCode.CONFLICT)
  })

  it('includes field errors on bad user input', () => {
    const error = badUserInputError('Invalid input', { email: ['Invalid email'] })

    expect(error.extensions).toEqual({
      code: ErrorCode.BAD_USER_INPUT,
      fieldErrors: { email: ['Invalid email'] },
    })
  })
})

describe('formatError', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps errors thrown on purpose', () => {
    const error = notFoundError('Transaction')
    const formatted = { message: error.message, extensions: error.extensions }

    expect(formatError(formatted, error)).toBe(formatted)
  })

  it('masks unexpected errors', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const unexpected = new Error('SQLITE_ERROR: no such table')
    const wrapped = new GraphQLError(unexpected.message, {
      originalError: unexpected,
      path: ['categories'],
    })

    const result = formatError({ message: unexpected.message, path: ['categories'] }, wrapped)

    expect(result).toEqual({
      message: 'Internal server error',
      locations: undefined,
      path: ['categories'],
      extensions: { code: ErrorCode.INTERNAL_SERVER_ERROR },
    })
    expect(console.error).toHaveBeenCalledWith(unexpected)
  })
})
