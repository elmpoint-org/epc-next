'use client';

import { useEffect, useMemo } from 'react';
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

import Timeline from './Timeline';
import TimelineControls from './TimelineControls';
import { useCalendarControls } from '../_util/controls';

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
  const events = query.data?.stays;
  function invalidate() {
    query.refetch();
  }

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
  };

  // KEYBOARD SHORTCUTS
  const actions = useCalendarControls(props);
  useEffect(() => {
    const dom = window.document;
    if (!dom) return;
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
          actions.last();
          break;
        case 'KeyN':
          actions.next();
          break;
        case 'KeyT':
          actions.today();
          break;
      }
    };

    // attach event listener
    dom.addEventListener('keydown', cb);
    return () => dom.removeEventListener('keydown', cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <InvalidateProvider cb={invalidate}>
        <div className="flex flex-col gap-4">
          {/* header bar */}
          <TimelineControls {...props} />

          {/* timeline view */}
          <Timeline {...props} />
        </div>
      </InvalidateProvider>
    </>
  );
}

export type CalendarProps = {
  events: EventType[] | undefined;
  isLoading: boolean;
  days: number;
  dates: {
    start: number;
    end: number;
  };
  updatePeriod: (d: number) => void;
  periodState: {
    days: number | undefined;
    setDays: (d: number | undefined) => void;
    startDate: Date;
    setStartDate: (d: Date) => void;
  };
};
