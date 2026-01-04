import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import fdeq from 'fast-deep-equal';

import { AppShell } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import NavAccount from './nav/NavAccount';
import NavLinks from './nav/NavLinks';
import Logo from './nav/Logo';

const Navbar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // close navbar on path change
  const path = usePathname();
  const sp = useSearchParams();
  const [lastPath, setLastPath] = useState(path);
  const [lastSP, setLastSP] = useState(sp);
  useEffect(() => {
    if (path !== lastPath || !fdeq(sp, lastSP)) {
      onClose();
      setLastPath(path);
      setLastSP(sp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, sp]);

  return (
    <>
      <AppShell.Navbar className="peer max-w-xs space-y-2 border-0 border-transparent bg-dgreen p-2 text-dwhite shadow-xl print:hidden">
        <AppShell.Section className="relative flex flex-row items-center p-4">
          <button
            className="group z-50 -m-4 p-4 data-[off]:invisible lg:invisible"
            data-off={!isOpen || null}
            onClick={onClose}
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
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};
export default Navbar;
