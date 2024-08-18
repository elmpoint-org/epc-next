'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import type { NavLinkType } from './navTypes';

export function useIsHere(
  links: Partial<NavLinkType>[],
  cb?: (here: boolean) => unknown,
) {
  const path = usePathname();

  const isHere = useMemo(() => {
    const p = '' + path;
    const here = links.some(
      (it) =>
        it.href &&
        p.startsWith(new URL(it.href, 'https://one.elmpoint.xyz').pathname),
    );
    cb?.(here);
    return here;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links, path]);

  return isHere;
}
