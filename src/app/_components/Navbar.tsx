import { AppShell, Collapse, ScrollArea } from '@mantine/core';
import { type useDisclosure } from '@mantine/hooks';

import {
  IconCircleChevronUp,
  IconCircleX,
  IconTrees,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import NavAccount from './nav/NavAccount';
import Link from 'next/link';
import NavLink from './nav/NavLink';
import NavBody from './nav/NavLinks';
import Logo from './nav/Logo';

const Navbar = ({
  navState,
}: {
  navState: ReturnType<typeof useDisclosure>;
}) => {
  const [opened, { close }] = navState;

  return (
    <>
      <AppShell.Navbar className="bg-dgreen text-dwhite max-w-xs space-y-2 border-emerald-900 p-2">
        <AppShell.Section className="relative flex flex-row items-center p-4">
          <button
            className="z-50 p-1 data-[off]:invisible"
            data-off={!opened || null}
            onClick={close}
          >
            <IconX />
          </button>
          <div className="absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center gap-4">
            {/* <IconTrees size={36} stroke={1} />
            <h1 className="text-xl">Elm Point</h1> */}
            <Logo className="fill-dwhite h-5" />
          </div>
        </AppShell.Section>
        <NavBody navState={navState} />
        <NavAccount />
      </AppShell.Navbar>
    </>
  );
};
export default Navbar;
