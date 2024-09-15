'use client';

import { useMemo } from 'react';

import { useWindowSize } from '@uidotdev/usehooks';
import { breakpoints } from '@/util/tailwindVars';
import {
  CALENDAR_DEFAULT_DAYS_DESKTOP,
  CALENDAR_DEFAULT_DAYS_MOBILE,
} from '@/CONSTANTS';

export function useDefaultDays() {
  const size = useWindowSize();

  const defaultDays = useMemo(() => {
    if (!size.width) return CALENDAR_DEFAULT_DAYS_DESKTOP;
    if (size.width >= breakpoints('sm')) return CALENDAR_DEFAULT_DAYS_DESKTOP;
    else return CALENDAR_DEFAULT_DAYS_MOBILE;
  }, [size.width]);
  return defaultDays;
}
