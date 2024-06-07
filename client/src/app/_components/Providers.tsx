'use client';

import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/query';
import { TrpcProvider } from '@/query/trpc';

import { theme } from '@/util/theme';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { UserProvider } from '../_ctx/userState';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RecoilRoot>
        <TrpcProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <MantineProvider theme={theme} defaultColorScheme="light">
                <Notifications position="top-right" />
                {children}
              </MantineProvider>
            </UserProvider>
          </QueryClientProvider>
        </TrpcProvider>
      </RecoilRoot>
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
