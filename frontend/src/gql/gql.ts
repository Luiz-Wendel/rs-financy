/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  fragment CategoryBaseFields on Category {\n    id\n    title\n    description\n    icon\n    color\n  }\n": typeof types.CategoryBaseFieldsFragmentDoc,
    "\n  fragment CategoryFields on Category {\n    ...CategoryBaseFields\n    transactionsCount\n    totalAmount\n  }\n": typeof types.CategoryFieldsFragmentDoc,
    "\n  query Categories {\n    categories {\n      ...CategoryFields\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": typeof types.DeleteCategoryDocument,
    "\n  query Dashboard($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      monthIncome\n      monthExpenses\n    }\n    recentTransactions: transactions(perPage: 5) {\n      items {\n        ...TransactionFields\n      }\n    }\n    categories {\n      ...CategoryFields\n    }\n  }\n": typeof types.DashboardDocument,
    "\n  fragment TransactionFields on Transaction {\n    id\n    description\n    type\n    amount\n    date\n    category {\n      ...CategoryBaseFields\n    }\n  }\n": typeof types.TransactionFieldsFragmentDoc,
    "\n  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        ...TransactionFields\n      }\n      total\n      page\n      perPage\n      totalPages\n    }\n  }\n": typeof types.TransactionsDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      ...TransactionFields\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TransactionFields\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  query Health {\n    health\n  }\n": typeof types.HealthDocument,
};
const documents: Documents = {
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n": types.UserFieldsFragmentDoc,
    "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n": types.MeDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  fragment CategoryBaseFields on Category {\n    id\n    title\n    description\n    icon\n    color\n  }\n": types.CategoryBaseFieldsFragmentDoc,
    "\n  fragment CategoryFields on Category {\n    ...CategoryBaseFields\n    transactionsCount\n    totalAmount\n  }\n": types.CategoryFieldsFragmentDoc,
    "\n  query Categories {\n    categories {\n      ...CategoryFields\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n": types.DeleteCategoryDocument,
    "\n  query Dashboard($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      monthIncome\n      monthExpenses\n    }\n    recentTransactions: transactions(perPage: 5) {\n      items {\n        ...TransactionFields\n      }\n    }\n    categories {\n      ...CategoryFields\n    }\n  }\n": types.DashboardDocument,
    "\n  fragment TransactionFields on Transaction {\n    id\n    description\n    type\n    amount\n    date\n    category {\n      ...CategoryBaseFields\n    }\n  }\n": types.TransactionFieldsFragmentDoc,
    "\n  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        ...TransactionFields\n      }\n      total\n      page\n      perPage\n      totalPages\n    }\n  }\n": types.TransactionsDocument,
    "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      ...TransactionFields\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TransactionFields\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  query Health {\n    health\n  }\n": types.HealthDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    name\n    email\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryBaseFields on Category {\n    id\n    title\n    description\n    icon\n    color\n  }\n"): (typeof documents)["\n  fragment CategoryBaseFields on Category {\n    id\n    title\n    description\n    icon\n    color\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryFields on Category {\n    ...CategoryBaseFields\n    transactionsCount\n    totalAmount\n  }\n"): (typeof documents)["\n  fragment CategoryFields on Category {\n    ...CategoryBaseFields\n    transactionsCount\n    totalAmount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Categories {\n    categories {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  query Categories {\n    categories {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Dashboard($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      monthIncome\n      monthExpenses\n    }\n    recentTransactions: transactions(perPage: 5) {\n      items {\n        ...TransactionFields\n      }\n    }\n    categories {\n      ...CategoryFields\n    }\n  }\n"): (typeof documents)["\n  query Dashboard($period: PeriodInput!) {\n    summary(period: $period) {\n      balance\n      monthIncome\n      monthExpenses\n    }\n    recentTransactions: transactions(perPage: 5) {\n      items {\n        ...TransactionFields\n      }\n    }\n    categories {\n      ...CategoryFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TransactionFields on Transaction {\n    id\n    description\n    type\n    amount\n    date\n    category {\n      ...CategoryBaseFields\n    }\n  }\n"): (typeof documents)["\n  fragment TransactionFields on Transaction {\n    id\n    description\n    type\n    amount\n    date\n    category {\n      ...CategoryBaseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        ...TransactionFields\n      }\n      total\n      page\n      perPage\n      totalPages\n    }\n  }\n"): (typeof documents)["\n  query Transactions($filter: TransactionFilter, $page: Int, $perPage: Int) {\n    transactions(filter: $filter, page: $page, perPage: $perPage) {\n      items {\n        ...TransactionFields\n      }\n      total\n      page\n      perPage\n      totalPages\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($id: ID!) {\n    deleteTransaction(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n    updateTransaction(id: $id, input: $input) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Health {\n    health\n  }\n"): (typeof documents)["\n  query Health {\n    health\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;