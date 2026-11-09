import { ApolloServerErrorCode, unwrapResolverError } from '@apollo/server/errors'
import { GraphQLError, type GraphQLFormattedError } from 'graphql'

export const ErrorCode = {
  BAD_USER_INPUT: ApolloServerErrorCode.BAD_USER_INPUT,
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
} as const

export type FieldErrors = Record<string, string[] | undefined>

export function badUserInputError(message: string, fieldErrors?: FieldErrors) {
  return new GraphQLError(message, {
    extensions: { code: ErrorCode.BAD_USER_INPUT, ...(fieldErrors && { fieldErrors }) },
  })
}

export function unauthenticatedError(message = 'You must be logged in') {
  return new GraphQLError(message, { extensions: { code: ErrorCode.UNAUTHENTICATED } })
}

/** Also used when the resource belongs to another user, so its existence is not leaked. */
export function notFoundError(resource: string) {
  return new GraphQLError(`${resource} not found`, { extensions: { code: ErrorCode.NOT_FOUND } })
}

export function conflictError(message: string) {
  return new GraphQLError(message, { extensions: { code: ErrorCode.CONFLICT } })
}

/**
 * Keeps errors created on purpose (GraphQLError) and masks unexpected ones,
 * so internal details (e.g. database errors) never reach the client.
 */
export function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapResolverError(error)

  if (originalError instanceof GraphQLError) {
    return formattedError
  }

  console.error(originalError)

  return {
    message: 'Internal server error',
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: { code: ErrorCode.INTERNAL_SERVER_ERROR },
  }
}
