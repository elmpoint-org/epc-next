'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/query';
import { TrpcProvider } from '@/query/trpc';

import { theme } from '@/util/theme';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TrpcProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            {children}
          </MantineProvider>
        </QueryClientProvider>
      </TrpcProvider>
    </>
  );
};

// inserts into html head
export const ProvidersHead = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
    </>
  );
};

export default Providers;
