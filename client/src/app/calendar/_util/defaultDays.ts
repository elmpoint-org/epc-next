'use client';

import { useOs } from '@mantine/hooks';
import { useMemo } from 'react';

export function useDefaultDays() {
  const os = useOs();
  const defaultDays = useMemo(() => {
    if (os === 'android' || os === 'ios') return 3;
    return 7;
  }, [os]);
  return defaultDays;
}
