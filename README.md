# Financy

Aplicação para organização de finanças pessoais: cada usuário cria sua conta e gerencia as próprias **transações** (receitas e despesas) e **categorias**.

Projeto final da pós-graduação da Rocketseat, dividido em dois projetos:

| Pasta                    | Descrição                                                         |
| ------------------------ | ----------------------------------------------------------------- |
| [`backend`](./backend)   | API GraphQL com TypeScript, Apollo Server, Prisma e SQLite        |
| [`frontend`](./frontend) | Aplicação React com Vite, Apollo Client, Tailwind CSS e shadcn/ui |

## Como rodar

Pré-requisito: Node.js `24.22.0` (há um `.nvmrc` na raiz: `nvm use`).

**1. API** (em um terminal)

```bash
cd backend
npm install
cp .env.example .env   # preencha o JWT_SECRET (ex.: openssl rand -hex 32)
npm run db:migrate
npm run db:seed        # opcional: conta demo
npm run dev            # http://localhost:4000/graphql
```

**2. Web** (em outro terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

Conta demo criada pelo seed: `demo@financy.app` / `12345678`.

## Testes

Cada projeto tem sua suíte (`npm test`), com cobertura acima de 90%:

- **Backend**: testes unitários, de integração de cada query e mutation (incluindo isolamento entre usuários) e e2e via HTTP, usando um banco SQLite separado.
- **Frontend**: testes de componentes, páginas e rotas com Testing Library, simulando a API com MSW.

Os detalhes de cada projeto estão nos READMEs de [`backend`](./backend/README.md) e [`frontend`](./frontend/README.md).
