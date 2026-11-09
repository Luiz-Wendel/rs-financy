# Financy API

API GraphQL para organização de finanças pessoais: cada usuário cria sua conta e gerencia as próprias **categorias** e **transações** (entradas e saídas).

## Stack

- **Node.js 24** + **TypeScript**
- **Apollo Server 5** (GraphQL) sobre **Express 5**, com CORS
- **Prisma 7** + **SQLite** (adapter `better-sqlite3`)
- **JWT** (`jsonwebtoken`) e **bcrypt** (`bcryptjs`) para autenticação
- **Zod** para validação de entrada e das variáveis de ambiente
- **Vitest** para testes unitários, de integração e e2e

## Como rodar

Pré-requisito: Node.js `24.22.0` (há um `.nvmrc` na raiz do repositório — `nvm use`).

```bash
cd backend
npm install                 # também gera o Prisma Client
cp .env.example .env        # preencha o JWT_SECRET
npm run db:migrate          # cria o banco SQLite e aplica as migrations
npm run db:seed             # opcional: conta demo com dados de exemplo
npm run dev
```

A API fica disponível em `http://localhost:4000/graphql`. Abrindo esse endereço no navegador, o Apollo Sandbox permite explorar o schema e executar operações.

**Conta demo** (criada pelo seed): `demo@financy.app` / `12345678`

## Variáveis de ambiente

| Variável           | Obrigatória | Padrão                  | Descrição                                                                                                 |
| ------------------ | ----------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `JWT_SECRET`       | sim         | —                       | Segredo usado para assinar os tokens (mínimo 16 caracteres)                                               |
| `DATABASE_URL`     | sim         | —                       | Caminho do banco SQLite, ex.: `file:./dev.db`                                                             |
| `JWT_EXPIRES_IN`   | não         | `7d`                    | Validade do token                                                                                         |
| `PORT`             | não         | `4000`                  | Porta do servidor                                                                                         |
| `CORS_ORIGIN`      | não         | `http://localhost:5173` | Origens permitidas, separadas por vírgula (ou `*`)                                                        |
| `CORS_METHODS`     | não         | `GET,POST,OPTIONS`      | Métodos HTTP permitidos em requisições de outras origens                                                  |
| `CORS_CREDENTIALS` | não         | `false`                 | Envia `Access-Control-Allow-Credentials` (cookies/credenciais). Exige origens explícitas em `CORS_ORIGIN` |
| `NODE_ENV`         | não         | `development`           | `development`, `test` ou `production`                                                                     |

Para gerar um segredo: `openssl rand -hex 32`.

## Scripts

| Script                  | Descrição                                       |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Servidor em modo watch                          |
| `npm run build`         | Compila para `dist/`                            |
| `npm start`             | Executa a versão compilada                      |
| `npm test`              | Roda todos os testes                            |
| `npm run test:watch`    | Testes em modo watch                            |
| `npm run test:coverage` | Testes com relatório de cobertura               |
| `npm run db:migrate`    | Cria/aplica migrations em desenvolvimento       |
| `npm run db:deploy`     | Aplica migrations existentes (produção/CI)      |
| `npm run db:seed`       | Recria a conta demo com categorias e transações |
| `npm run db:studio`     | Abre o Prisma Studio                            |
| `npm run lint`          | ESLint                                          |
| `npm run typecheck`     | Checagem de tipos (inclui testes)               |
| `npm run format`        | Prettier                                        |

## Autenticação

`register` e `login` retornam um JWT. As demais operações exigem o header:

```
Authorization: Bearer <token>
```

Cada usuário só enxerga e altera os próprios dados: acessar uma categoria ou transação de outro usuário retorna `NOT_FOUND`, sem revelar que ela existe.

## Schema

### Convenções

- **Valores monetários** são inteiros em **centavos** (`R$ 89,50` → `8950`) e sempre positivos; o sinal vem do `type` (`INCOME` ou `EXPENSE`). Cada transação vai até **R$ 1.000.000.000,00**. Usam o scalar `SafeInt` (inteiro de até 2^53 − 1), já que o `Int` do GraphQL tem 32 bits, e são guardados como `BigInt` no banco.
- **`Date`** é uma data sem horário (`2026-11-30`); **`DateTime`** é um timestamp ISO 8601.
- Nas mutations de edição, só os campos enviados são alterados.
- Excluir uma categoria **exclui também todas as suas transações**.

### Queries

| Query                                 | Descrição                                                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `me: User!`                           | Usuário logado                                                                                                                       |
| `categories: [Category!]!`            | Categorias do usuário em ordem alfabética, com `transactionsCount` e `totalAmount`                                                   |
| `transactions(filter, page, perPage)` | Transações paginadas (padrão 10, máx. 50), mais recentes primeiro. Filtros: `search`, `type`, `categoryId`, `period { year, month }` |
| `summary(period): Summary!`           | `balance` (saldo de todas as transações), `monthIncome` e `monthExpenses` do mês (padrão: mês atual)                                 |
| `health: String!`                     | Verificação de disponibilidade                                                                                                       |

### Mutations

| Mutation                                     | Descrição                                             |
| -------------------------------------------- | ----------------------------------------------------- |
| `register(input: { name, email, password })` | Cria a conta e retorna `{ token, user }`              |
| `login(input: { email, password })`          | Retorna `{ token, user }`                             |
| `updateProfile(input: { name })`             | Atualiza o nome (o e-mail não pode ser alterado)      |
| `createCategory(input)`                      | `title`, `description?`, `icon`, `color`              |
| `updateCategory(id, input)`                  | Edição parcial                                        |
| `deleteCategory(id): ID!`                    | Exclui a categoria e suas transações                  |
| `createTransaction(input)`                   | `description`, `type`, `amount`, `date`, `categoryId` |
| `updateTransaction(id, input)`               | Edição parcial                                        |
| `deleteTransaction(id): ID!`                 | Exclui a transação                                    |

Ícones aceitos (nomes do [Lucide](https://lucide.dev/icons)): `briefcase-business`, `car-front`, `heart-pulse`, `piggy-bank`, `shopping-cart`, `ticket`, `tool-case`, `utensils`, `paw-print`, `house`, `gift`, `dumbbell`, `book-open`, `baggage-claim`, `mailbox`, `receipt-text`.

Cores aceitas: `green`, `blue`, `purple`, `pink`, `red`, `orange`, `yellow`.

### Exemplo

```graphql
mutation {
  createTransaction(
    input: {
      description: "Jantar no Restaurante"
      type: EXPENSE
      amount: 8950
      date: "2026-11-30"
      categoryId: "<id da categoria>"
    }
  ) {
    id
    amount
    category {
      title
    }
  }
}
```

### Erros

Os erros seguem o formato padrão do GraphQL, com o código em `extensions.code`:

| Código                  | Quando                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| `BAD_USER_INPUT`        | Entrada inválida; `extensions.fieldErrors` traz as mensagens de cada campo |
| `UNAUTHENTICATED`       | Sem token, token inválido/expirado ou credenciais incorretas no login      |
| `NOT_FOUND`             | Recurso inexistente ou de outro usuário                                    |
| `CONFLICT`              | E-mail já cadastrado                                                       |
| `INTERNAL_SERVER_ERROR` | Erro inesperado (os detalhes ficam apenas no log do servidor)              |

## Testes

```bash
npm test
```

Os testes usam um banco SQLite separado (`test.db`), criado com as migrations antes da suíte e removido ao final — o banco de desenvolvimento não é afetado.

- **Unitários** (`src/**/*.spec.ts`): env, JWT, senha, contexto, erros, validação, períodos
- **Integração** (`test/graphql`): cada query e mutation, incluindo isolamento entre usuários
- **E2E** (`test/e2e`, `src/app.spec.ts`): fluxo de autenticação e CORS via HTTP

## Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma        # modelos User, Category e Transaction
│   ├── migrations/
│   └── seed.ts              # conta demo
├── src/
│   ├── config/env.ts        # validação das variáveis de ambiente
│   ├── lib/                 # prisma, jwt, senha
│   ├── graphql/
│   │   ├── context.ts       # usuário autenticado + requireAuth
│   │   ├── errors.ts        # erros padronizados e mascaramento
│   │   ├── validation.ts    # validação de input com Zod
│   │   ├── schema.ts        # junta os módulos
│   │   └── modules/         # auth, user, category, transaction, dashboard...
│   │       └── <módulo>/    # *.graphql.ts (typeDefs + resolvers), *.service.ts, *.schemas.ts
│   ├── app.ts               # Express + CORS + Apollo
│   └── server.ts            # entrypoint
└── test/                    # helpers, testes de integração e e2e
```
