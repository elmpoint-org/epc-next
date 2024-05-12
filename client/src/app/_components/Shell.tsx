'use client';

import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Navbar from './Navbar';
import { IconMenu } from '@tabler/icons-react';

const Shell = ({ children }: { children: React.ReactNode }) => {
  const navState = useDisclosure();
  const [isOpen, { open }] = navState;

  return (
    <>
      <button className="fixed left-0 top-0 z-50 p-4" onClick={open}>
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

// header={{ height: 60 }}
// <AppShell.Header className="bg-dgreen border-emerald-900">
//   <Group h="100%" px="md">

//     <IconTrees size={30} className="text-dwhite" />
//   </Group>
// </AppShell.Header>

// <Burger
// opened={opened}
// onClick={toggle}
// hiddenFrom="sm"
// size="sm"
// color={opened ? 'white' : 'black'}
// className="fixed left-3 top-3 z-[1000]"
// />
