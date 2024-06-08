import { initGraphQLTada } from 'gql.tada';
import type { introspection } from '@/../graphql-schema.d.ts';
import { api } from '@/util/dev';
import request, { GraphQLClient } from 'graphql-request';

export const graphql = initGraphQLTada<{
  introspection: introspection;
}>();

export type Headers = NonNullable<Parameters<typeof request>[3]>;

export const graph = new GraphQLClient(api + '/gql');
