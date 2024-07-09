import type { DeepNavLinks } from '@/app/_components/nav/navTypes';

import {
  IconBoxMargin,
  IconCalendar,
  IconCalendarPlus,
  IconEyeQuestion,
  IconHome2,
  IconNotebook,
} from '@tabler/icons-react';

export const navLinks: DeepNavLinks = [
  { href: '/', text: 'Home', icon: IconHome2 },
  {
    text: 'Calendar',
    icon: IconCalendar,
    links: [
      {
        text: 'View Calendar',
        href: '/calendar',
        icon: IconCalendar,
      },
      {
        text: 'Add Stay',
        href: '/calendar/new',
        icon: IconCalendarPlus,
      },
      // ...
    ],
  },
  {
    text: 'CMS',
    icon: IconBoxMargin,
    links: [
      { href: '/cms/pages', text: 'Pages', icon: IconNotebook },
      // ...
    ],
  },
  {
    text: 'Reference Pages',
    icon: IconEyeQuestion,
    links: [
      {
        text: 'Camp How-tos',
        href: '/pages/instructions',
      },
      // ...
    ],
  },
];
