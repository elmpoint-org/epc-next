import { AppShell, ScrollArea } from '@mantine/core';
import {
  IconCalendarPlus,
  IconEyeQuestion,
  IconHome,
  IconNotebook,
} from '@tabler/icons-react';

import NavLink, { NavLinkType } from './NavLink';

const links: NavLinkType[] = [
  { href: '/', text: 'Home', icon: IconHome },
  { href: '/pages/instructions', text: 'Camp How-tos', icon: IconEyeQuestion },
  {
    href: '/calendar/new',
    text: 'Calendar - Add Stay',
    icon: IconCalendarPlus,
  },
  { href: '/cms/pages', text: 'Pages', icon: IconNotebook },

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
            <NavLink key={i} {...it} />
          ))}
        </div>
      </AppShell.Section>
    </>
  );
};
export default NavLinks;
