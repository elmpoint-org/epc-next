import { breakpoints } from '@/util/tailwindVars';
import { useWindowSize } from '@uidotdev/usehooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useDisplayByRooms() {
  const windowSize = useWindowSize();
  const sq = useSearchParams();
  const router = useRouter();

  const Key = 'rooms';

  const state = useMemo(() => {
    if (windowSize.width && windowSize.width < breakpoints('sm')) return false;
    const str = sq.get(Key);
    return str === 'true' || str === '1';
  }, [sq, windowSize.width]);
  function set(nv: boolean) {
    const query = new URLSearchParams(sq);
    query.set(Key, nv ? '1' : '0');
    router.push('?' + query.toString(), { scroll: false });
  }

  return [state, set] as const;
}

const VIEWS = {
  TIMELINE: true,
  AGENDA: true,
} as const;
export type ViewType = keyof typeof VIEWS;
const allViews = Object.keys(VIEWS) as ViewType[];

export function useCalendarView() {
  const sq = useSearchParams();
  const router = useRouter();

  const Key = 'view';

  const state = useMemo<ViewType>(() => {
    const str = sq.get(Key);
    return allViews.includes(str as any) ? (str as ViewType) : 'TIMELINE';
  }, [sq]);
  function set(nv: ViewType) {
    const query = new URLSearchParams(sq);
    query.set(Key, nv);
    router.push('?' + query.toString(), { scroll: false });
  }

  return [state, set] as const;
}
