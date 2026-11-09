import { CombinedGraphQLErrors } from '@apollo/client'

/** API messages shown to the user, translated to Portuguese. */
const messages: Record<string, string> = {
  'Invalid email or password': 'E-mail ou senha inválidos',
  'Email already in use': 'Este e-mail já está em uso',
  'Category not found': 'Categoria não encontrada',
  'Transaction not found': 'Transação não encontrada',
  'You must be logged in': 'Sua sessão expirou. Entre novamente',
}

const DEFAULT_MESSAGE = 'Algo deu errado. Tente novamente'

/** Turns an Apollo error into a message for the user. */
export function getErrorMessage(error: unknown): string {
  if (CombinedGraphQLErrors.is(error)) {
    const [first] = error.errors
    if (!first) return DEFAULT_MESSAGE

    if (first.extensions?.code === 'BAD_USER_INPUT') {
      return 'Verifique os dados informados'
    }

    return messages[first.message] ?? DEFAULT_MESSAGE
  }

  if (error instanceof TypeError || (error instanceof Error && error.name === 'ServerError')) {
    return 'Não foi possível conectar ao servidor'
  }

  return DEFAULT_MESSAGE
}
