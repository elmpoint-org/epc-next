import type { DeepNavLinks } from '@/app/_components/nav/navTypes';

import {
  IconBoxMargin,
  IconCalendar,
  IconClick,
  IconEyeQuestion,
  IconFolders,
  IconHome2,
  IconNotebook,
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
    text: 'CMS',
    scope: ['EDIT'],
    icon: IconBoxMargin,
    links: [
      { href: '/cms/pages', text: 'Pages', icon: IconNotebook },
      { href: '/cms/files', text: 'File Manager', icon: IconFolders },
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
      { text: '' },
      // ...
    ],
  },
];
