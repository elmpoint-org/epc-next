import { useOs } from '@mantine/hooks';
import { useMemo } from 'react';

/** get the computer type for displaying keyboard shortcuts. */
export function useKeyboardKeys() {
  const os = useOs();
  const keys = useMemo<'MOBILE' | 'MAC' | 'STANDARD'>(() => {
    if (os === 'macos') return 'MAC';
    if (os === 'android' || os === 'ios') return 'MOBILE';
    return 'STANDARD';
  }, [os]);

  return keys;
}
