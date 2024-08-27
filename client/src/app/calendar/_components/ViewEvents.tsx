'use client';

import { useMemo, useState } from 'react';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { ResultOf } from '@graphql-typed-document-node/core';
import { dateTS, dateTSLocal, dayjs } from '../_util/dateUtils';
import { Inside } from '@/util/inferTypes';
import { useDefaultDays } from '../_util/defaultDays';
import { SetState } from '@/util/stateType';

import Timeline from './Timeline';
import TimelineControls from './TimelineControls';
import { createCallbackCtx } from '@/app/_ctx/callback';

const EVENTS_QUERY = graphql(`
  query Stays($start: Int!, $end: Int!) {
    stays(start: $start, end: $end) {
      id
      title
      description
      author {
        id
        name
      }
      dateStart
      dateEnd
      reservations {
        name
        room {
          ... on Room {
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

// COMPONENT
export default function ViewEvents() {
  // date picker state
  const [startDate, setStartDate] = useState<Date>(new Date());
  function updatePeriod(d: number) {
    setStartDate(new Date(dateTSLocal(d) * 1000));
  }

  // days
  const defaultDays = useDefaultDays();
  const [days, setDays] = useState<number | undefined>(defaultDays);
  const daysWithDefault = days ?? defaultDays;

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

  const props: CalendarProps = {
    events,
    isLoading: query.isFetching,
    days: daysWithDefault,
    dates: parsedDates,
    updatePeriod,
    periodState: {
      days,
      setDays,
      startDate,
      setStartDate,
    },
  };

  return (
    <>
      <InvalidateProvider cb={invalidate}>
        <div className="flex flex-col gap-4">
          {/* header bar */}
          <TimelineControls {...props} />

          {/* timeline view */}
          <Timeline {...props} />

          <hr />
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
    setDays: SetState<number | undefined>;
    startDate: Date;
    setStartDate: SetState<Date>;
  };
};
