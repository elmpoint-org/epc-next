import type { IconType } from '@/util/iconType';

export type NavLinkType = {
  href?: string;
  text: React.ReactNode;
  icon?: IconType;
  exact?: boolean;
};

export type NavDropdownType = Omit<NavLinkType, 'href' | 'exact'> & {
  links: NavLinkType[];
};

export type DeepNavLinks = (NavDropdownType | NavLinkType)[];
