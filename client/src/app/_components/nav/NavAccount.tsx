import Link from 'next/link';

import { AppShell, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronLeft,
  IconCircleChevronUp,
  IconUser,
  IconLogin2,
} from '@tabler/icons-react';
import { IconType } from '@/util/iconType';

const Links: {
  href: string;
  text: React.ReactNode;
  icon?: IconType;
}[] = [
  {
    href: '/auth/login',
    text: 'Log in',
    icon: IconLogin2,
  },
  { href: '#', text: '' },
  { href: '#', text: '' },
  { href: '#', text: '' },
  { href: '#', text: '' },
];

const NavAccount = ({
  navState: [, { close: closeNavbar }],
}: {
  navState: ReturnType<typeof useDisclosure>;
}) => {
  const [isOpen, { toggle, close }] = useDisclosure();

  return (
    <>
      <AppShell.Section className="rounded-lg bg-emerald-900">
        <Collapse in={isOpen}>
          <div className="flex flex-col gap-2 p-4">
            {Links.map(({ href, text, icon: Icon }, i) => (
              <Link
                key={i}
                href={href}
                onClick={() => {
                  close();
                  closeNavbar();
                }}
                className="flex flex-row items-center gap-5 rounded-full bg-dgreen px-4 py-2.5 hover:bg-emerald-700/50"
              >
                <div className="size-5">
                  {Icon && <Icon className="h-full" />}
                </div>
                <div className="flex-1 leading-none">{text}</div>
              </Link>
            ))}
            {/* {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-10 rounded-full bg-dgreen"></div>
              ))} */}
          </div>
        </Collapse>
        <button
          className="flex w-full flex-row items-center gap-2 rounded-lg bg-emerald-700/80 px-4 py-3 hover:bg-emerald-700"
          onClick={toggle}
        >
          <IconUser size={20} />
          <div className="flex-1 text-left">Michael Foster</div>

          {isOpen ? <IconCircleChevronUp /> : <IconCircleChevronLeft />}
        </button>
      </AppShell.Section>
    </>
  );
};
export default NavAccount;
