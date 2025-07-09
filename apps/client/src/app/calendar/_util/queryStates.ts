import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWindowSize } from '@uidotdev/usehooks';

import { breakpoints } from '@/util/tailwindVars';
import { QP } from '../_components/Calendar';
import {
  CALENDAR_DEFAULT_VIEW,
  CALENDAR_DEFAULT_VIEW_MOBILE,
} from '@/CONSTANTS';

export function useDisplayByRooms() {
  const windowSize = useWindowSize();
  const sq = useSearchParams();
  const router = useRouter();

  const Key: QP = 'rooms';

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
  OVERVIEW: true,
  CALCIUM: true,
} as const;
export type ViewType = keyof typeof VIEWS;
const allViews = Object.keys(VIEWS) as ViewType[];

export function useCalendarView() {
  const sq = useSearchParams();
  const router = useRouter();

  // responsive default
  const windowSize = useWindowSize();
  const defaultView: ViewType =
    (windowSize.width ?? 0) > breakpoints('sm')
      ? CALENDAR_DEFAULT_VIEW
      : CALENDAR_DEFAULT_VIEW_MOBILE;

  const Key: QP = 'view';

  const state = useMemo<ViewType>(() => {
    const str = sq.get(Key);
    return allViews.includes(str as any) ? (str as ViewType) : defaultView;
  }, [defaultView, sq]);
  function set(nv: ViewType) {
    const query = new URLSearchParams(sq);
    query.set(Key, nv);
    router.push('?' + query.toString(), { scroll: false });
  }

  function next() {
    const index = allViews.indexOf(state);
    const nextIndex = (index + 1) % allViews.length;
    set(allViews[nextIndex]);
  }

  return [state, set, next] as const;
}
