'use client';

import { useMemo } from 'react';

import { useWindowSize } from '@uidotdev/usehooks';
import { useBreakpoints } from '@/util/tailwindVars';
import {
  CALENDAR_DEFAULT_DAYS_DESKTOP,
  CALENDAR_DEFAULT_DAYS_MOBILE,
} from '@/CONSTANTS';

export function useDefaultDays() {
  const size = useWindowSize();

  const bp_sm = useBreakpoints('sm');

  const defaultDays = useMemo(() => {
    if (!size.width || bp_sm === null) return CALENDAR_DEFAULT_DAYS_DESKTOP;
    if (size.width >= bp_sm) return CALENDAR_DEFAULT_DAYS_DESKTOP;
    else return CALENDAR_DEFAULT_DAYS_MOBILE;
  }, [bp_sm, size.width]);
  return defaultDays;
}
