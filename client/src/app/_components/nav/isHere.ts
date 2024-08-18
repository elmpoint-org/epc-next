'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import type { NavLinkType } from './navTypes';

export function useIsHere(
  links: Partial<NavLinkType>[],
  cb?: (here: boolean) => unknown,
  exact?: boolean,
) {
  const path = usePathname();

  const isHere = useMemo(() => {
    const p = '' + path;
    const here = links.some(
      (it) =>
        it.href &&
        (exact
          ? p === comparableURL(it.href)
          : p.startsWith(comparableURL(it.href))),
    );
    cb?.(here);
    return here;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links, path]);

  return isHere;
}

function comparableURL(url: string) {
  return new URL(url, 'https://one.elmpoint.xyz').pathname;
}
