import type { DeepNavLinks, NavLinkType } from '@/app/_components/nav/navTypes';
import { NAV_MAKE_SPACER } from '@/app/_components/nav/NavLink';

import {
  IconBoxMargin,
  IconCalendar,
  IconClick,
  IconDoor,
  IconFolders,
  IconHelp,
  IconHome2,
  IconLogout,
  IconNotebook,
  IconTableOptions,
  IconUsersGroup,
} from '@tabler/icons-react';

export const navLinks: DeepNavLinks = [
  { href: '/', text: 'Home', icon: IconHome2, exact: true },
  {
    text: 'Calendar',
    href: '/calendar',
    icon: IconCalendar,
  },
  { href: '/pages/links', text: 'Updates & Links', icon: IconClick },
  {
    text: 'Site Help',
    icon: IconHelp,
    links: [
      { href: '/pages/help', text: 'Help Home', icon: IconHelp },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
  },
  {
    text: 'CMS',
    scope: ['EDIT'],
    icon: IconBoxMargin,
    links: [
      { href: '/cms/pages', text: 'Pages', icon: IconNotebook },
      { href: '/cms/files', text: 'File Manager', icon: IconFolders },
      { href: '/cms/rooms', text: 'Rooms & Cabins', icon: IconDoor },
    ],
  },
];

export const accountNavLinks: NavLinkType[] = [
  {
    href: '/account',
    text: 'Account Settings',
    icon: IconTableOptions,
    exact: true,
  },
  {
    href: '/account/family',
    text: 'My Family',
    icon: IconUsersGroup,
    exact: true,
  },
  { text: NAV_MAKE_SPACER },
  {
    href: '/auth/logout',
    text: 'Log out',
    icon: IconLogout,
  },
];
