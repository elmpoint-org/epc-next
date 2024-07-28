import type { DeepNavLinks } from '@/app/_components/nav/navTypes';

import {
  IconBoxMargin,
  IconCalendar,
  IconCalendarPlus,
  IconClick,
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
      { text: '' },
      // ...
    ],
  },
  {
    text: 'CMS',
    icon: IconBoxMargin,
    links: [
      { href: '/cms/pages', text: 'Pages', icon: IconNotebook },
      { text: '' },
      { text: '' },
      { text: '' },
      // ...
    ],
  },
  {
    text: 'Reference Pages',
    icon: IconEyeQuestion,
    links: [
      { href: '/pages/links', text: 'Updates & Links', icon: IconClick },
      {
        text: 'Camp How-tos',
        href: '/pages/instructions',
      },
      // ...
    ],
  },
];
