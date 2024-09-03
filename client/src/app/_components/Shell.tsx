'use client';

import type { Children } from '@/util/propTypes';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Navbar from './Navbar';
import NavOpen from './nav/NavOpen';

const Shell = ({ children }: Children) => {
  const navState = useDisclosure();
  const [isOpen, { open }] = navState;

  return (
    <>
      <NavOpen onClick={open} />

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
          <div className="container mx-auto flex print:!max-w-none flex-1 flex-col">
            {children}
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  );
};
export default Shell;
