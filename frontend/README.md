# Financy Web

Aplicação React para organização de finanças pessoais. Consome a [API GraphQL](../backend) e segue o layout do Figma do projeto.

## Funcionalidades

- Cadastro, login (com "Lembrar-me") e logout
- **Dashboard**: saldo total, receitas e despesas do mês, transações recentes e categorias mais usadas
- **Transações**: listagem paginada com busca, filtros por tipo, categoria e período, criação, edição e exclusão
- **Categorias**: resumo, cards com ícone e cor, criação, edição e exclusão (as transações da categoria também são excluídas)
- **Perfil**: edição do nome
- Feedback com toasts, estados de carregamento, vazio e de erro com "Tentar novamente"

## Stack

- **React 19** + **TypeScript** + **Vite** (sem framework)
- **Apollo Client 4** para GraphQL, com tipos gerados pelo **GraphQL Code Generator**
- **Tailwind CSS 4** + **shadcn/ui** (Radix UI) com o tema do Style Guide do Figma
- **React Router**, **React Hook Form** + **Zod**, **Sonner** (toasts), **Lucide** (ícones)
- **Vitest** + **Testing Library** + **MSW** para testes

## Como rodar

Pré-requisitos: Node.js `24.22.0` (`nvm use` na raiz do repositório) e a [API](../backend) rodando.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`. Com o seed da API (`npm run db:seed` no backend) é possível entrar com `demo@financy.app` / `12345678`.

## Style Guide

Em desenvolvimento, `http://localhost:5173/style-guide` mostra os tokens (cores e tipografia) e todos os componentes do Style Guide do Figma, com seus estados. A página é carregada sob demanda e não entra no build de produção.

## Variáveis de ambiente

| Variável           | Descrição               | Exemplo                         |
| ------------------ | ----------------------- | ------------------------------- |
| `VITE_BACKEND_URL` | Endereço da API GraphQL | `http://localhost:4000/graphql` |

A variável é validada na inicialização (`src/env.ts`).

## Scripts

| Script                  | Descrição                                             |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento                           |
| `npm run build`         | Checagem de tipos + build de produção em `dist/`      |
| `npm run preview`       | Serve o build de produção                             |
| `npm test`              | Roda todos os testes                                  |
| `npm run test:watch`    | Testes em modo watch                                  |
| `npm run test:coverage` | Testes com relatório de cobertura                     |
| `npm run codegen`       | Gera os tipos das operações a partir do schema da API |
| `npm run lint`          | ESLint                                                |
| `npm run typecheck`     | Checagem de tipos                                     |
| `npm run format`        | Prettier                                              |

## GraphQL tipado

As operações ficam em `src/api` e são escritas com a função `graphql()`. O codegen lê o schema exportado pela API (`backend/schema.graphql`) e gera os tipos em `src/gql`, que são versionados. Ao criar ou alterar uma operação, rode:

```bash
npm run codegen
```

Depois de criar, editar ou excluir transações e categorias, o cache do Apollo é invalidado (`src/lib/cache.ts`), então dashboard, listas e totais se atualizam sozinhos.

## Autenticação

O token JWT é guardado no `localStorage` quando "Lembrar-me" está marcado e no `sessionStorage` caso contrário. Ele é enviado no header `Authorization` de cada requisição. Se a API rejeitar o token (expirado ou inválido), a sessão é encerrada e o usuário volta para o login.

| Rota          | Acesso                                  |
| ------------- | --------------------------------------- |
| `/`           | Login (deslogado) ou Dashboard (logado) |
| `/cadastro`   | Apenas deslogado                        |
| `/transacoes` | Apenas logado                           |
| `/categorias` | Apenas logado                           |
| `/perfil`     | Apenas logado                           |

## Testes

```bash
npm test
```

Os testes rodam em jsdom e simulam a API com o **MSW**: nenhuma requisição chega à API real, e uma requisição sem mock faz o teste falhar.

- **Componentes** (`src/components`): campos, select, dialog, paginação, formulários de transação e categoria
- **Páginas** (`src/pages`): fluxos completos de login, cadastro, dashboard, transações, categorias e perfil
- **Rotas** (`src/app/routes.spec.tsx`): redirecionamentos para usuários logados e deslogados
- **Utilitários** (`src/lib`): formatação de moeda e datas, períodos, máscara de valor, erros

## Estrutura

```
frontend/
├── src/
│   ├── api/            # operações GraphQL (queries, mutations e fragments)
│   ├── app/            # providers, rotas, guardas e layouts (navbar)
│   ├── assets/         # logo
│   ├── components/
│   │   ├── ui/         # componentes do Style Guide (button, text-field, select, dialog...)
│   │   ├── categories/ # card, ícone, seletores de ícone e cor, modal
│   │   ├── transactions/ # tabela, filtros, tipo, modal
│   │   └── dashboard/  # cards de resumo, transações recentes, categorias
│   ├── gql/            # tipos gerados pelo codegen
│   ├── hooks/
│   ├── lib/            # apollo, auth, formatação e utilitários
│   ├── pages/          # uma página por rota
│   ├── test/           # setup, MSW, fixtures e helpers de render
│   └── index.css       # tema (tokens do Style Guide)
└── codegen.ts
```
