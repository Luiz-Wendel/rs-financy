import { prisma } from '../../src/lib/prisma.js'

/** Removes every row. Deleting users cascades to categories and transactions. */
export async function resetDatabase() {
  await prisma.user.deleteMany()
}
