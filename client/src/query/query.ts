import {
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { Headers, graph } from './graphql';

export const queryClient = new QueryClient();

type QueryOpts = {
  headers?: () => Headers;
  addToKey?: unknown;
} & Partial<UseQueryOptions>;

// graph query
export const useGraphQuery = <TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables, opts]: TVariables extends Record<string, never>
    ? [(null | undefined)?, QueryOpts?]
    : [TVariables, QueryOpts?]
) => {
  const key: Array<unknown> = [document, variables];
  if (typeof opts?.addToKey !== 'undefined') key.push(opts.addToKey);

  return useQuery({
    queryKey: key,
    queryFn: async () =>
      graph.request(document, variables ?? undefined, opts?.headers?.()),
    ...opts,
  }) as UseQueryResult<TResult>;
};
