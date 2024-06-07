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
import { IconType } from '@/util/iconType';
import { useUser } from '@/app/_ctx/userState';

const Links: {
  href: string;
  text: React.ReactNode;
  icon?: IconType;
}[] = [
  {
    href: '/account',
    text: 'Account Overview',
    icon: IconTableOptions,
  },
  { href: '#', text: '' },
  { href: '#', text: '' },
  { href: '#', text: '' },
  {
    href: '/auth/logout',
    text: 'Log out',
    icon: IconLogout,
  },
];

const NavAccount = () => {
  const [isOpen, { toggle, close }] = useDisclosure();

  const { user } = useUser();

  return (
    <>
      <AppShell.Section className="rounded-lg bg-emerald-900">
        {/* account menu */}
        {user && (
          <Collapse in={isOpen}>
            <div className="flex flex-col gap-2 p-4">
              {Links.map(({ href, text, icon: Icon }, i) => (
                <Link
                  key={i}
                  href={href}
                  onClick={() => close()}
                  className="flex flex-row items-center gap-5 rounded-full bg-dgreen px-4 py-2.5 hover:bg-emerald-700/50"
                >
                  <div className="size-5">
                    {Icon && <Icon className="h-full" />}
                  </div>
                  <div className="flex-1 leading-none">{text}</div>
                </Link>
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
};
export default NavAccount;

function NavAccountButton({
  isOpen,
  ...props
}: { isOpen?: boolean } & JSX.IntrinsicElements['button']) {
  const {
    user,
    query: { isInitialLoading: isLoading },
  } = useUser();

  return (
    <button
      className="relative flex w-full flex-row items-center gap-2 overflow-hidden rounded-lg bg-emerald-700/80 px-4 py-3 hover:bg-emerald-700 data-[nu]:px-6"
      disabled={isLoading}
      data-nu={(!isLoading && !user) || null}
      {...props}
    >
      {!isLoading ? (
        <>
          {/* button content with/without a user */}
          {user ? (
            <>
              <IconUser size={20} />
              <div className="flex-1 text-left">{user.name}</div>

              {isOpen ? <IconCircleChevronUp /> : <IconCircleChevronLeft />}
            </>
          ) : (
            <>
              <div className="flex-1 text-left">Log in</div>
              <IconLogin2 size={20} />
            </>
          )}
        </>
      ) : (
        <>
          {/* skeleton */}
          <div className="size-4 animate-pulse rounded-full bg-emerald-600/50"></div>
          <div className="h-4 w-2/3 flex-shrink animate-pulse rounded-full bg-emerald-600/50"></div>
          <div className="flex-1"></div>
          <div className="size-6 animate-pulse rounded-full bg-emerald-600/50"></div>
        </>
      )}
    </button>
  );
}
