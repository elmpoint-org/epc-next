import Link from 'next/link';

import { AppShell, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronLeft,
  IconCircleChevronUp,
  IconUser,
  IconLogin2,
} from '@tabler/icons-react';

import { accountNavLinks } from '@/sample-data/navLinksData';
import { useUser } from '@/app/_ctx/user/context';
import { useIsHere } from './isHere';
import NavLink from './NavLink';

export default function NavAccount() {
  const [isOpen, { toggle, open, close }] = useDisclosure();

  const user = useUser();

  useIsHere(accountNavLinks, (h) => (h ? open() : close()));

  return (
    <>
      <AppShell.Section className="rounded-lg bg-emerald-900">
        {/* account menu */}
        {user && (
          <Collapse in={isOpen}>
            <div className="flex flex-col gap-2 p-4">
              {accountNavLinks.map((it, i) => (
                <NavLink key={i} {...it} variant="LIGHT" />
              ))}
            </div>
          </Collapse>
        )}

        {/* account primary button */}

        {user ? (
          <NavAccountButton isOpen={isOpen} onClick={toggle} />
        ) : (
          <Link href="/auth/login">
            <NavAccountButton />
          </Link>
        )}
      </AppShell.Section>
    </>
  );
}

function NavAccountButton({
  isOpen,
  ...props
}: { isOpen?: boolean } & JSX.IntrinsicElements['button']) {
  const user = useUser();

  return (
    <button
      className="relative flex w-full flex-row items-center gap-3 overflow-hidden rounded-lg bg-emerald-700/80 px-4 py-3 hover:bg-emerald-700 data-[nu]:px-6"
      data-nu={!user || null}
      {...props}
    >
      <>
        {/* button content with/without a user */}
        {user ? (
          <>
            <IconUser size={20} />
            <div className="flex-1 truncate text-left">{user.name}</div>

            {isOpen ? <IconCircleChevronUp /> : <IconCircleChevronLeft />}
          </>
        ) : (
          <>
            <div className="flex-1 text-left">Log in</div>
            <IconLogin2 size={20} />
          </>
        )}
      </>
    </button>
  );
}
