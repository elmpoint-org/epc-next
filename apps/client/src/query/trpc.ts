import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query';

import type { AppRouter } from '@epc/server/trpc';

import { api } from '@/util/dev';

const links = [httpBatchLink({ url: api + '/api' })];

export const tclient = createTRPCClient<AppRouter>({ links });
export const trpc = createTRPCReact<AppRouter>();

export const createClient = () =>
  trpc.createClient({
    links,
  });
