/**
 * Creates a demo account with categories and transactions similar to the Figma layout.
 * Login: demo@financy.app / 12345678 — running it again recreates the demo data.
 */
import { prisma } from '../src/lib/prisma.js'
import { hashPassword } from '../src/lib/password.js'

const DEMO_EMAIL = 'demo@financy.app'

const categories = [
  {
    key: 'food',
    title: 'Alimentação',
    description: 'Restaurantes, delivery e refeições',
    icon: 'utensils',
    color: 'blue',
  },
  {
    key: 'transport',
    title: 'Transporte',
    description: 'Gasolina, transporte público e viagens',
    icon: 'car-front',
    color: 'purple',
  },
  {
    key: 'market',
    title: 'Mercado',
    description: 'Compras de supermercado e mantimentos',
    icon: 'shopping-cart',
    color: 'orange',
  },
  {
    key: 'investment',
    title: 'Investimento',
    description: 'Aplicações e retornos financeiros',
    icon: 'piggy-bank',
    color: 'green',
  },
  {
    key: 'utilities',
    title: 'Utilidades',
    description: 'Energia, água, internet e telefone',
    icon: 'tool-case',
    color: 'yellow',
  },
  {
    key: 'salary',
    title: 'Salário',
    description: 'Renda mensal e bonificações',
    icon: 'briefcase-business',
    color: 'green',
  },
  {
    key: 'entertainment',
    title: 'Entretenimento',
    description: 'Cinema, jogos e lazer',
    icon: 'ticket',
    color: 'pink',
  },
  {
    key: 'health',
    title: 'Saúde',
    description: 'Medicamentos, consultas e exames',
    icon: 'heart-pulse',
    color: 'red',
  },
] as const

type CategoryKey = (typeof categories)[number]['key']

/** [description, category, type, amount in cents, months ago, day] */
const transactions: [string, CategoryKey, 'INCOME' | 'EXPENSE', number, number, number][] = [
  ['Pagamento de Salário', 'salary', 'INCOME', 425000, 0, 1],
  ['Jantar no Restaurante', 'food', 'EXPENSE', 8950, 0, 3],
  ['Posto de Gasolina', 'transport', 'EXPENSE', 10000, 0, 4],
  ['Compras no Mercado', 'market', 'EXPENSE', 15680, 0, 5],
  ['Retorno de Investimento', 'investment', 'INCOME', 34025, 0, 6],
  ['Aluguel', 'utilities', 'EXPENSE', 170000, 0, 6],
  ['Freelance', 'salary', 'INCOME', 250000, 0, 7],
  ['Compras Jantar', 'market', 'EXPENSE', 15000, 0, 8],
  ['Cinema', 'entertainment', 'EXPENSE', 8800, 0, 8],
  ['Farmácia', 'health', 'EXPENSE', 6420, 0, 9],
  ['Almoço no Shopping', 'food', 'EXPENSE', 5490, 0, 9],
  ['Uber', 'transport', 'EXPENSE', 2380, 0, 9],
  ['Pagamento de Salário', 'salary', 'INCOME', 425000, 1, 1],
  ['Conta de Energia', 'utilities', 'EXPENSE', 21540, 1, 10],
  ['Internet', 'utilities', 'EXPENSE', 9990, 1, 12],
  ['Supermercado', 'market', 'EXPENSE', 48730, 1, 14],
  ['Pizza', 'food', 'EXPENSE', 7900, 1, 18],
  ['Show', 'entertainment', 'EXPENSE', 25000, 1, 22],
  ['Pagamento de Salário', 'salary', 'INCOME', 425000, 2, 1],
  ['Consulta Médica', 'health', 'EXPENSE', 35000, 2, 11],
  ['Viagem de Carro', 'transport', 'EXPENSE', 32000, 2, 20],
]

function dateInPastMonth(monthsAgo: number, day: number) {
  const now = new Date()
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, day))
  // Never create transactions in the future
  return date > now
    ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    : date
}

async function main() {
  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } })

  const user = await prisma.user.create({
    data: { name: 'Conta Teste', email: DEMO_EMAIL, passwordHash: await hashPassword('12345678') },
  })

  const categoryIds = new Map<CategoryKey, string>()
  for (const { key, ...data } of categories) {
    const category = await prisma.category.create({ data: { ...data, userId: user.id } })
    categoryIds.set(key, category.id)
  }

  await prisma.transaction.createMany({
    data: transactions.map(([description, category, type, amount, monthsAgo, day]) => ({
      description,
      type,
      amount,
      date: dateInPastMonth(monthsAgo, day),
      categoryId: categoryIds.get(category)!,
      userId: user.id,
    })),
  })

  console.log(`Seeded ${categories.length} categories and ${transactions.length} transactions.`)
  console.log(`Login: ${DEMO_EMAIL} / 12345678`)
}

await main()
await prisma.$disconnect()
