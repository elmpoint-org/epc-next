import type { IconType } from '@/util/iconType';

export type NavLinkType = {
  href?: string;
  text: React.ReactNode;
  icon?: IconType;
};

export type NavDropdownType = Omit<NavLinkType, 'href'> & {
  links: NavLinkType[];
};

export type DeepNavLinks = (NavDropdownType | NavLinkType)[];
