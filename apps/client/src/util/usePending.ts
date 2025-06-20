import { useCallback, useState } from 'react';

import fdeq from 'fast-deep-equal';

export type IsPending<T> = (item: T) => boolean;
export type RunPending<T> = (
  items: T[],
) => (cb: () => Promise<void>) => Promise<void>;

/**
 * similar to useLoading, but maintains a list of pending items for you to reference.
 * @returns [isPending, runPending]
 */
export function usePending<ItemType>() {
  const [pendingItems, setPendingItems] = useState<ItemType[]>([]);

  const runPending: RunPending<ItemType> = useCallback(
    (items: ItemType[]) => async (cb: () => Promise<void>) => {
      setPendingItems((c) => [...c, ...items]);
      await cb();
      setPendingItems((c) => c.filter((a) => !items.some((b) => fdeq(a, b))));
    },
    [],
  );

  const isPending: IsPending<ItemType> = useCallback(
    (item: ItemType) => pendingItems.some((it) => fdeq(it, item)),
    [pendingItems],
  );

  return [isPending, runPending] as const;
}
