'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { ResultOf } from '@graphql-typed-document-node/core';
import {
  dateStartOfWeek,
  dateTS,
  dateTSLocal,
  dateTSObject,
  dayjs,
} from '../_util/dateUtils';
import { Inside } from '@/util/inferTypes';
import { useDefaultDays } from '../_util/defaultDays';
import { createCallbackCtx } from '@/app/_ctx/callback';
import { useCalendarControls } from '../_util/controls';
import { useCalendarView, useDisplayByRooms } from '../_util/queryStates';
import { SetState } from '@/util/stateType';

import Timeline from './Timeline';
import Controls from './Controls';
import Agenda from './Agenda';
import Overview, { OVERVIEW_NUM_WEEKS } from './Overview';
import {
  GlobalKeyboardHandler,
  useGlobalKeyboardShortcuts,
} from '@/app/_ctx/globalKeyboard';

export const CALENDAR_EVENT_FRAGMENT = graphql(`
  fragment CalendarEvent on Stay @_unmask {
    id
    title
    description
    author {
      id
      name
      avatarUrl
      trustedUsers {
        id
      }
    }
    dateStart
    dateEnd
    reservations {
      name
      room {
        ... on Room {
          id
          name
          cabin {
            id
            name
          }
        }
        ... on CustomRoom {
          text
        }
      }
    }
  }
`);
export const EVENTS_QUERY = graphql(
  `
    query Stays($start: Int!, $end: Int!) {
      stays(start: $start, end: $end) {
        ...CalendarEvent
      }
    }
  `,
  [CALENDAR_EVENT_FRAGMENT],
);
export type EventType = Inside<ResultOf<typeof EVENTS_QUERY>['stays']>;

export const { Provider: InvalidateProvider, useHook: useInvalidate } =
  createCallbackCtx();

/** query parameters */
export type QP = 'date' | 'days' | 'rooms' | 'view';

// COMPONENT
export default function Calendar() {
  const sq = useSearchParams();
  const router = useRouter();

  // calendar view
  const [view] = useCalendarView();

  // days
  const defaultDays = useDefaultDays();
  const days = useMemo(() => {
    if (view === 'OVERVIEW') return 31;
    const num = parseInt(sq.get('days' satisfies QP) ?? '');
    if (!Number.isFinite(num)) return undefined;
    return num;
  }, [sq, view]);
  const daysWithDefault = days ?? defaultDays;
  function setDays(d: typeof days) {
    updateQuery('days', d ?? '');
  }

  // date picker state
  const startDate = useMemo(() => {
    const num = parseInt(sq.get('date' satisfies QP) ?? '');
    let startDateNum = Number.isFinite(num) ? num : null;
    if (startDateNum === null) {
      if (daysWithDefault !== 7) return new Date();
      startDateNum = dateStartOfWeek(dateTS(new Date()));
    }
    if (view === 'OVERVIEW')
      startDateNum = dateTSObject(startDateNum).startOf('month').unix();
    return new Date(dateTSLocal(startDateNum) * 1000);
  }, [daysWithDefault, sq, view]);
  function setStartDate(d: typeof startDate) {
    updateQuery('date', dateTS(d));
  }
  function updatePeriod(d: number) {
    setStartDate(new Date(dateTSLocal(d) * 1000));
  }

  function updateQuery(key: QP, val: string | number) {
    const query = new URLSearchParams(sq);
    if (days && view !== 'OVERVIEW') query.set('days' satisfies QP, '' + days);
    query.set('date' satisfies QP, '' + dateTS(startDate));
    query.set(key, '' + val);
    router.push('?' + query.toString(), { scroll: false });
  }

  const endDate = useMemo(
    () =>
      dayjs(startDate)
        .add(daysWithDefault - 1, 'days')
        .toDate(),
    [daysWithDefault, startDate],
  );
  const parsedDates = useMemo(() => {
    let start = dateTS(startDate);
    let end = dateTS(endDate);

    if (view === 'OVERVIEW') {
      const s = dateTSObject(start).startOf('month').startOf('week');
      start = s.unix();
      end = s.add(7 * OVERVIEW_NUM_WEEKS, 'days').unix();
    }

    return { start, end };
  }, [endDate, startDate, view]);

  const selectedDate = useMemo(() => {
    return dateTS(startDate);
  }, [startDate]);

  // get calendar events
  const query = useGraphQuery(EVENTS_QUERY, parsedDates);
  const events = useMemo(
    () => query.data?.stays.sort((a, b) => a.dateStart - b.dateStart),
    [query.data?.stays],
  );
  function invalidate() {
    query.refetch();
  }

  // room collapse state
  const [roomCollapse, setRoomCollapse] = useState<RoomCollapse>('CLOSED');
  const fullCollapse = useState(true);
  const _dbr = useDisplayByRooms();
  const toggleDisplayByRoom = useCallback(() => _dbr[1](!_dbr[0]), [_dbr]);

  // CALENDAR PROPS
  const props: CalendarProps = {
    events,
    isLoading: query.isFetching,
    days: daysWithDefault,
    dates: parsedDates,
    updatePeriod,
    periodState: {
      days,
      startDate,
      setStartDate,
      setDays,
    },
    selectedDate,
    roomCollapse: {
      state: roomCollapse,
      set: setRoomCollapse,
      full: fullCollapse,
    },
  };

  // KEYBOARD SHORTCUTS
  const actions = useCalendarControls(props);
  const keyboardHandler = useCallback<GlobalKeyboardHandler>(
    (e, { withModifiers }) => {
      switch (e.code) {
        case 'KeyP':
          if (withModifiers) break;
          actions.last();
          break;
        case 'KeyN':
          if (withModifiers) break;
          actions.next();
          break;
        case 'KeyT':
          if (withModifiers) break;
          actions.today();
          break;
        case 'KeyR':
          if (withModifiers) break;
          toggleDisplayByRoom();
          break;
      }
    },
    [actions, toggleDisplayByRoom],
  );
  useGlobalKeyboardShortcuts(keyboardHandler);

  return (
    <>
      <InvalidateProvider cb={invalidate}>
        <div className="relative flex flex-col gap-4">
          {/* header bar */}
          <Controls {...props} />

          {/* timeline view */}
          {view === 'TIMELINE' && <Timeline {...props} />}

          {/* agenda view */}
          {view === 'AGENDA' && <Agenda {...props} />}

          {/* overview view */}
          {view === 'OVERVIEW' && <Overview {...props} />}
        </div>
      </InvalidateProvider>
    </>
  );
}

export type CalendarProps = {
  events: EventType[] | undefined;
  updatePeriod: (d: number) => void;
  isLoading: boolean;
  days: number;
  dates: {
    start: number;
    end: number;
  };
  selectedDate: number;
  periodState: {
    days: number | undefined;
    setDays: (d: number | undefined) => void;
    startDate: Date;
    setStartDate: (d: Date) => void;
  };
  roomCollapse: {
    state: RoomCollapse;
    set: (s: RoomCollapse) => void;
    full: [boolean, SetState<boolean>];
  };
};
export type RoomCollapse = 'OPEN' | 'CLOSED' | 'MIXED';
