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
  dayjs,
} from '../_util/dateUtils';
import { Inside } from '@/util/inferTypes';
import { useDefaultDays } from '../_util/defaultDays';
import { createCallbackCtx } from '@/app/_ctx/callback';
import { useCalendarControls } from '../_util/controls';
import { useDisplayByRooms } from '../_util/displayByRooms';
import { SetState } from '@/util/stateType';

import Timeline from './Timeline';
import TimelineControls from './TimelineControls';
import Agenda from './Agenda';

const EVENTS_QUERY = graphql(`
  query Stays($start: Int!, $end: Int!) {
    stays(start: $start, end: $end) {
      id
      title
      description
      author {
        id
        name
        avatarUrl
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
  }
`);
export type EventType = Inside<ResultOf<typeof EVENTS_QUERY>['stays']>;

const { Provider: InvalidateProvider, useHook: useInvalidate } =
  createCallbackCtx();
export { useInvalidate };

/** query parameters */
export type QP = 'date' | 'days';

// COMPONENT
export default function ViewEvents() {
  const sq = useSearchParams();
  const router = useRouter();

  // days
  const defaultDays = useDefaultDays();
  const days = useMemo(() => {
    const num = parseInt(sq.get('days' as QP) ?? '');
    if (!Number.isFinite(num)) return undefined;
    return num;
  }, [sq]);
  const daysWithDefault = days ?? defaultDays;
  function setDays(d: typeof days) {
    updateQuery('days', d ?? '');
  }

  // date picker state
  const startDate = useMemo(() => {
    const num = parseInt(sq.get('date' as QP) ?? '');
    let startDateNum = Number.isFinite(num) ? num : null;
    if (startDateNum === null) {
      if (daysWithDefault !== 7) return new Date();
      startDateNum = dateStartOfWeek(dateTS(new Date()));
    }
    return new Date(dateTSLocal(startDateNum) * 1000);
  }, [daysWithDefault, sq]);
  function setStartDate(d: typeof startDate) {
    updateQuery('date', dateTS(d));
  }
  function updatePeriod(d: number) {
    setStartDate(new Date(dateTSLocal(d) * 1000));
  }

  function updateQuery(key: QP, val: string | number) {
    const query = new URLSearchParams(sq);
    if (days) query.set('days' as QP, '' + days);
    query.set('date' as QP, '' + dateTS(startDate));
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
  const parsedDates = useMemo(
    () => ({
      start: dateTS(startDate),
      end: dateTS(endDate),
    }),
    [endDate, startDate],
  );

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
    roomCollapse: {
      state: roomCollapse,
      set: setRoomCollapse,
      full: fullCollapse,
    },
  };

  // KEYBOARD SHORTCUTS
  const actions = useCalendarControls(props);
  useEffect(() => {
    const dom = window.document;
    if (!dom) return;

    const withModifiers = (e: KeyboardEvent) =>
      e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;

    const cb = (e: KeyboardEvent) => {
      // make sure user isn't typing
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      )
        return;

      // handle keyboard shortcuts
      switch (e.code) {
        case 'KeyP':
          if (withModifiers(e)) break;
          actions.last();
          break;
        case 'KeyN':
          if (withModifiers(e)) break;
          actions.next();
          break;
        case 'KeyT':
          if (withModifiers(e)) break;
          actions.today();
          break;
        case 'KeyR':
          if (withModifiers(e)) break;
          toggleDisplayByRoom();
          break;
      }
    };

    // attach event listener
    dom.addEventListener('keydown', cb);
    return () => dom.removeEventListener('keydown', cb);
  }, [actions, toggleDisplayByRoom]);

  return (
    <>
      <InvalidateProvider cb={invalidate}>
        <div className="relative flex flex-col gap-4">
          {/* header bar */}
          <TimelineControls {...props} />

          {/* timeline view */}
          <Timeline {...props} />

          {/* agenda view */}
          <Agenda {...props} />
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
