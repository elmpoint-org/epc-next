'use client';

import { useState } from 'react';

import { useDebouncedCallback } from '@mantine/hooks';

export function useDebounceWithStatus<T extends Array<unknown>>(
  cb: (...args: T) => void,
  timeout: number,
) {
  const [isPending, setIsPending] = useState(false);

  const trigger = useDebouncedCallback((...args: T) => {
    cb(...args);
    setIsPending(false);
  }, timeout);

  function debounce(...args: T) {
    if (!isPending) setIsPending(true);
    trigger(...args);
  }

  return { debounce, isPending };
}
