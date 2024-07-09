import Link from 'next/link';

import { AppShell, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronLeft,
  IconCircleChevronUp,
  IconUser,
  IconLogin2,
  IconLogout,
  IconTableOptions,
} from '@tabler/icons-react';

import { useUser } from '@/app/_ctx/user/context';
import { useIsHere } from './isHere';
import NavLink from './NavLink';
import { NavLinkType } from './navTypes';

const links: NavLinkType[] = [
  {
    href: '/account',
    text: 'Account Overview',
    icon: IconTableOptions,
  },
  { text: '' },
  { text: '' },
  { text: '' },
  {
    href: '/auth/logout',
    text: 'Log out',
    icon: IconLogout,
  },
];

export default function NavAccount() {
  const [isOpen, { toggle, open, close }] = useDisclosure();

  const user = useUser();

  useIsHere(links, (h) => (h ? open() : close()));

  return (
    <>
      <AppShell.Section className="rounded-lg bg-emerald-900">
        {/* account menu */}
        {user && (
          <Collapse in={isOpen}>
            <div className="flex flex-col gap-2 p-4">
              {links.map((it, i) => (
                <NavLink
                  key={i}
                  {...it}
                  className="border-emerald-800 bg-dgreen hover:bg-emerald-700/50"
                />
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
