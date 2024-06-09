import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query';

import type { AppRouter } from '@@/api/router';

import { api } from '@/util/dev';

const links = [httpBatchLink({ url: api + '/api' })];

export const trpc = createTRPCReact<AppRouter>();

export const createClient = () =>
  trpc.createClient({
    links,
  });

export const tclient = createTRPCClient<AppRouter>({ links });
