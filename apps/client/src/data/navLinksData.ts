import type { DeepNavLinks, NavLinkType } from '@/app/_components/nav/navTypes';
import { NAV_MAKE_SPACER } from '@/app/_components/nav/NavLink';

import {
  IconBoxMargin,
  IconCalendar,
  IconCalendarMonth,
  IconCalendarUser,
  IconClick,
  IconDoor,
  IconFolders,
  IconHelp,
  IconHome2,
  IconListDetails,
  IconLogout,
  IconMailCog,
  IconMapRoute,
  IconMessageChatbot,
  IconNews,
  IconNotebook,
  IconTable,
  IconUserCog,
  IconUsersGroup,
} from '@tabler/icons-react';

export const navLinks: DeepNavLinks = [
  { href: '/', text: 'Home', icon: IconHome2, exact: true },
  {
    text: 'Calendar',
    icon: IconCalendar,
    links: [
      {
        href: '/calendar',
        text: 'Calendar',
        icon: IconCalendarMonth,
        exact: true,
        dontMatch: ['/calendar?view=TIMELINE&rooms=1', '/calendar?view=AGENDA'],
      },
      {
        href: '/calendar?view=TIMELINE&rooms=1',
        text: 'Rooms Table',
        icon: IconTable,
        exact: true,
      },
      {
        href: '/calendar?view=AGENDA',
        text: 'Arrivals/Departures',
        icon: IconListDetails,
        exact: true,
      },
      {
        href: '/calendar/me',
        text: 'My Stays',
        icon: IconCalendarUser,
        exact: true,
      },
    ],
  },
  { href: '/pages/updates', text: 'Recent Updates', icon: IconNews },
  { href: '/pages/links', text: 'Protected Links', icon: IconClick },
  { href: '/pages/instructions', text: 'Camp Guides', icon: IconMapRoute },
  {
    text: 'Site Help',
    icon: IconHelp,
    links: [
      { href: '/pages/help', text: 'Help Home', icon: IconHelp, exact: true },
      {
        href: '/pages/help/feedback',
        text: 'Feedback & Support',
        icon: IconMessageChatbot,
      },
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
    icon: IconUserCog,
    exact: true,
  },
  {
    href: '/account/notifications',
    text: 'Notification Settings',
    icon: IconMailCog,
  },
  {
    href: '/account/trusted-users',
    text: 'My Trusted Users',
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
