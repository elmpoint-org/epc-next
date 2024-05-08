'use client';

import { theme } from '@/util/theme';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {/*  */}
        {children}
      </MantineProvider>
    </>
  );
};

export const HeadProviders = () => {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
    </>
  );
};

export default Providers;
