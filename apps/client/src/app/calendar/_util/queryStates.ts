import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWindowSize } from '@uidotdev/usehooks';

import { useBreakpoints } from '@/util/tailwindVars';
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

  const bp_sm = useBreakpoints('sm');
  const state = useMemo(() => {
    if (windowSize.width && bp_sm !== null && windowSize.width < bp_sm)
      return false;
    const str = sq.get(Key);
    return str === 'true' || str === '1';
  }, [bp_sm, sq, windowSize.width]);
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
  const bp_sm = useBreakpoints('sm');
  const defaultView: ViewType =
    (windowSize.width ?? 0) > (bp_sm ?? -1)
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
