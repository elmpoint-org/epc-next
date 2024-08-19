import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '@/../graphql-schema.d.ts';
import { api } from '@/util/dev';
import request, { GraphQLClient, GraphQLResponse } from 'graphql-request';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { getAuthHeader } from './query';
import { Inside } from '@/util/inferTypes';

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export type GraphQLError = Inside<GraphQLResponse['errors']>;

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

export const oldGraphAuth = <R, V>(...[d, v]: GQL<R, V, {}>) =>
  graph.request(d, v ?? undefined, {
    authorization: getAuthHeader(),
  });

export async function graphAuth<R, V>(...[d, v]: GQL<R, V, {}>) {
  let errors: GraphAuthErrors | null = null;

  const data = await graph
    .request(d, v ?? undefined, {
      authorization: getAuthHeader(),
    })
    .catch((e) => {
      let errs = (e?.response as GraphQLResponse)?.errors;

      const parsed = errs?.map((e) => {
        const out: Inside<typeof errors> = {
          code: null,
          error: e,
        };

        const code = e?.extensions?.code;
        if (typeof code === 'string') out.code = code;
        return out;
      });

      errors = parsed ?? null;
      return undefined;
    });

  errors = errors as GraphAuthErrors | null;

  return { errors, data };
}
export type GraphAuthErrors = {
  code: string | null;
  error: GraphQLError;
}[];

export function getGQLError(e: unknown) {
  let out;
  if (e && typeof e === 'object' && 'response' in e)
    out= (e.response as GraphQLResponse)?.errors;
  return out ?? null;
}
