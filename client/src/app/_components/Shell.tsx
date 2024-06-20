'use client';

import type { Children } from '@/util/propTypes';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu } from '@tabler/icons-react';

import Navbar from './Navbar';

const Shell = ({ children }: Children) => {
  const navState = useDisclosure();
  const [isOpen, { open }] = navState;

  return (
    <>
      <button
        className="fixed left-0 top-0 z-50 rounded-br-2xl bg-dwhite/30 p-4 transition-all hover:bg-dwhite/60"
        onClick={open}
      >
        <IconMenu />
      </button>

      <AppShell
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: { mobile: !isOpen },
        }}
        padding="md"
      >
        <Navbar navState={navState} />

        <AppShell.Main className="ml-0 flex flex-col bg-slate-200 p-4 pt-12 lg:ml-[300px]">
          <div className="container mx-auto flex flex-1 flex-col">
            {children}
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  );
};
export default Shell;
