import { AppShell, ScrollArea } from '@mantine/core';

import NavLink from './NavLink';
import type { NavLinkType } from './_util/linksType';

const links: NavLinkType[] = [
  { href: '/', text: 'Home' },
  { href: '/pages/instructions', text: 'Camp How-tos' },

  { href: '/calendar/new', text: 'Calendar - Add Stay' },
  { href: '/cms/page/new', text: 'Page Creator' },

  { href: '#', text: <>&nbsp;</> },
  { href: '#', text: <>&nbsp;</> },
  { href: '#', text: <>&nbsp;</> },
  { href: '#', text: <>&nbsp;</> },
];

const NavLinks = () => {
  return (
    <>
      <AppShell.Section
        grow
        renderRoot={(p) => (
          <ScrollArea
            {...p}
            classNames={{
              scrollbar: '!bg-transparent',
            }}
          />
        )}
      >
        <div className="flex flex-col space-y-2 p-2">
          {links.map((it, i) => (
            <NavLink key={i} href={it.href}>
              {it.text}
            </NavLink>
          ))}
        </div>
      </AppShell.Section>
    </>
  );
};
export default NavLinks;
