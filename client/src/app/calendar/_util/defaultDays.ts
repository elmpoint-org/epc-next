'use client';

import { useMemo } from 'react';

import { useWindowSize } from '@uidotdev/usehooks';
import { breakpoints } from '@/util/breakpoints';

export function useDefaultDays() {
  const size = useWindowSize();

  const defaultDays = useMemo(() => {
    if (!size.width) return 7;
    if (size.width >= breakpoints('sm')) return 7;
    else return 4;
  }, [size.width]);
  return defaultDays;
}
