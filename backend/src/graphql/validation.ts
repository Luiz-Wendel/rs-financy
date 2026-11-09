import { z } from 'zod'

import { badUserInputError } from './errors.js'

/** Parses resolver input with Zod, throwing a BAD_USER_INPUT error with field errors. */
export function validateInput<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input)

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error) as {
      fieldErrors: Record<string, string[] | undefined>
    }

    throw badUserInputError('Invalid input', fieldErrors)
  }

  return result.data
}
