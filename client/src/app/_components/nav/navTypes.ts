import { AuthUser } from '@/app/_ctx/user/provider';
import type { IconType } from '@/util/iconType';

export type NavLinkType = {
  href?: string;
  text: React.ReactNode;
  icon?: IconType;
  /** page will only show as active if the url path is an exact match, not a sub-page */
  exact?: boolean;
  /** add negative link matches */
  dontMatch?: string[];
  /** pass a scope to make this entry only appear if users pass a scope check. set to true to only appear for logged in users. */
  scope?: boolean | (AuthUser['scope'] & {});
};

export type NavDropdownType = Omit<NavLinkType, 'href' | 'exact'> & {
  links: NavLinkType[];
};

export type DeepNavLinks = (NavDropdownType | NavLinkType)[];
