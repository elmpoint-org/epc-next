'use client';

import { Children } from '@/util/propTypes';
import { useState } from 'react';
import { createClient, trpc } from './trpc';
import { queryClient } from './query';

export const TrpcProvider = ({ children }: Children) => {
  const [trpcClient] = useState(createClient);
  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </trpc.Provider>
    </>
  );
};
