import { CombinedGraphQLErrors } from '@apollo/client'
import { describe, expect, it } from 'vitest'

import { getErrorMessage } from './errors'

function graphQLError(message: string, code: string) {
  return new CombinedGraphQLErrors({ errors: [{ message, extensions: { code } }] })
}

describe('getErrorMessage', () => {
  it('translates known API messages', () => {
    expect(getErrorMessage(graphQLError('Invalid email or password', 'UNAUTHENTICATED'))).toBe(
      'E-mail ou senha inválidos',
    )
    expect(getErrorMessage(graphQLError('Email already in use', 'CONFLICT'))).toBe(
      'Este e-mail já está em uso',
    )
  })

  it('uses a generic message for invalid input', () => {
    expect(getErrorMessage(graphQLError('Invalid input', 'BAD_USER_INPUT'))).toBe(
      'Verifique os dados informados',
    )
  })

  it('reports connection problems', () => {
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Não foi possível conectar ao servidor',
    )
  })

  it('falls back to a generic message', () => {
    expect(getErrorMessage(graphQLError('Internal server error', 'INTERNAL_SERVER_ERROR'))).toBe(
      'Algo deu errado. Tente novamente',
    )
    expect(getErrorMessage('???')).toBe('Algo deu errado. Tente novamente')
  })
})
