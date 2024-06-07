import { usePathname } from 'next/navigation';

import { AppShell } from '@mantine/core';
import type { useDisclosure } from '@mantine/hooks';

import { IconX } from '@tabler/icons-react';
import NavAccount from './nav/NavAccount';
import NavLinks from './nav/NavLinks';
import Logo from './nav/Logo';
import { useEffect, useRef, useState } from 'react';

const Navbar = ({
  navState,
}: {
  navState: ReturnType<typeof useDisclosure>;
}) => {
  const [opened, { close }] = navState;

  // close navbar on path change
  const path = usePathname();
  const [lastPath, setLastPath] = useState(path);
  useEffect(() => {
    if (path !== lastPath) {
      close();
      setLastPath(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <>
      <AppShell.Navbar className="max-w-xs space-y-2 border-emerald-900 bg-dgreen p-2 text-dwhite">
        <AppShell.Section className="relative flex flex-row items-center p-4">
          <button
            className="group z-50 -m-4 p-4 data-[off]:invisible"
            data-off={!opened || null}
            onClick={close}
          >
            <div className="rounded-full p-1 group-hover:bg-emerald-700 group-hover:text-slate-50">
              <IconX />
            </div>
          </button>
          <div className="absolute left-0 top-0 flex h-full w-full flex-row items-center justify-center gap-4">
            <Logo className="h-5 fill-dwhite" />
          </div>
        </AppShell.Section>
        <NavLinks />
        <NavAccount />
      </AppShell.Navbar>
    </>
  );
};
export default Navbar;
