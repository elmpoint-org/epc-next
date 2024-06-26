'use client';

import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/query/query';

import { theme } from '@/theme/theme';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { TrpcProvider } from '@/query/trpcProvider';
import { ModalProvider } from '@/theme/modals';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RecoilRoot>
        <TrpcProvider>
          <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme} defaultColorScheme="light">
              <ModalProvider>
                <Notifications position="top-right" />
                {children}
              </ModalProvider>
            </MantineProvider>
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
