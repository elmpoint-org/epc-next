'use client';

import { createTRPCReact, httpBatchLink } from '@trpc/react-query';

import type { AppRouter } from '@@/api/router';
import { Children } from '@/util/childrenType';

import { api } from '@/util/dev';
import { useState } from 'react';
import { queryClient } from './query';

export const trpc = createTRPCReact<AppRouter>();

export const TrpcProvider = ({ children }: Children) => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: api + '/api' })],
    }),
  );

  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </>
  );
};
