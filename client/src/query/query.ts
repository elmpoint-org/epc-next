import {
  QueryClient,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { GQL, Headers, graph } from './graphql';
import cookies from '@/util/cookies';

export const queryClient = new QueryClient();

export const getAuthHeader = () => {
  const t = cookies.get('USER_AUTH');
  if (!t?.length) return '';
  return `Bearer ${t}`;
};

export type QueryOpts = {
  headers?: () => Headers;
  addToKey?: unknown;
  withSuspense?: boolean;
} & Partial<UseQueryOptions>;

export type QueryResult<T extends () => UseQueryResult> =
  ReturnType<T>['data'] & {};

const VOID_QUERY = { queryKey: ['VOID'], queryFn: () => null };

// graph query
export const useGraphQuery = <R, V>(
  ...[document, variables, opts]: GQL<R, V, QueryOpts>
) => {
  const key: Array<unknown> = [document, variables];
  if (typeof opts?.addToKey !== 'undefined') key.push(opts.addToKey);
  const query: UseQueryOptions = {
    queryKey: key,
    queryFn: async () =>
      graph.request(document, variables ?? undefined, {
        authorization: getAuthHeader(),
        ...opts?.headers?.(),
      }),
    ...opts,
  };

  const s = opts?.withSuspense ?? false;

  const qr = useQuery(!s ? query : VOID_QUERY);
  const qs = useSuspenseQuery(s ? query : VOID_QUERY);
  return (!s ? qr : qs) as UseQueryResult<R>;
};
