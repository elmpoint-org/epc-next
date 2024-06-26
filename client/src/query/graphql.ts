import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '@/../graphql-schema.d.ts';
import { api } from '@/util/dev';
import request, { GraphQLClient } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getAuthHeader } from './query';

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export const oldGraphError = (e: any) =>
  (e?.errors?.[0]?.extensions?.code as string) || null;

export const graphError = (e: any) =>
  (e?.[0]?.extensions?.code as string) || null;

export type Headers = NonNullable<Parameters<typeof request>[3]>;

export type GQL<R, V, O> =
  V extends Record<string, never>
    ? [
        document: TypedDocumentNode<R, V>,
        variables?: {} | null | undefined,
        opts?: O,
      ]
    : [document: TypedDocumentNode<R, V>, variables: V, opts?: O];

export const graph = new GraphQLClient(api + '/gql');

export const graphAuth = <R, V>(...[d, v]: GQL<R, V, {}>) =>
  graph.request(d, v ?? undefined, {
    authorization: getAuthHeader(),
  });
