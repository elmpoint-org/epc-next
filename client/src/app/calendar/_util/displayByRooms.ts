import { breakpoints } from '@/util/tailwindVars';
import { useWindowSize } from '@uidotdev/usehooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useDisplayByRooms() {
  const windowSize = useWindowSize();
  const sq = useSearchParams();
  const router = useRouter();

  const SQ_KEY = 'rooms';

  const state = useMemo(() => {
    if (windowSize.width && windowSize.width < breakpoints('sm')) return false;
    const str = sq.get(SQ_KEY);
    return str === 'true' || str === '1';
  }, [sq, windowSize.width]);
  function set(nv: boolean) {
    const query = new URLSearchParams(sq);
    query.set(SQ_KEY, nv ? '1' : '0');
    router.push('?' + query.toString(), { scroll: false });
  }

  return [state, set] as const;
}
