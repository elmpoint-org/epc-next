'use client';

import { useMemo } from 'react';

import type { NavLinkType } from './navTypes';
import { siteDomain } from '@/util/dev';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

export function useIsHere(
  links: Partial<NavLinkType>[],
  cb?: (here: boolean) => unknown,
  exact?: boolean,
) {
  const ps = usePathname();
  const qs = useSearchParams();

  const isHere = useMemo(() => {
    let here = links.some(
      (it) => it.href && compareLinks(it.href, [ps, qs], exact, it.dontMatch),
    );
    cb?.(here);
    return here;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exact, links, ps, qs]);

  return isHere;
}

function compareLinks(
  link_: string,
  [currentPath, currentSearch]: [string, ReadonlyURLSearchParams],
  isExact?: boolean,
  dontMatch?: string[],
  __isRecursed?: boolean,
): boolean {
  const link = new URL(link_, siteDomain);

  // if not exact, allow partial match
  if (!isExact) return currentPath.startsWith(link.pathname);

  // otherwise, check full path
  if (link.pathname !== currentPath) return false;

  // check querystring if needed
  if (link.search) {
    const linkQS = new URLSearchParams(link.search);
    const curUrlQS = new URLSearchParams(currentSearch);
    for (const [key, value] of linkQS.entries()) {
      if (curUrlQS.get(key) !== value) {
        return false;
      }
    }
  }

  // handle "don't match" array
  if (
    dontMatch?.some((link) =>
      compareLinks(link, [currentPath, currentSearch], isExact, [], true),
    )
  )
    return false;

  // it's a match!
  return true;
}
