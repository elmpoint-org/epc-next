'use client';

import { useMemo, useState } from 'react';
import { ResultOf } from '@graphql-typed-document-node/core';

import { ActionIcon, NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
} from '@tabler/icons-react';

import { dayStyles } from '../_util/dayStyles';
import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { D1, dateTS, dateTSLocal, dayjs } from '../_util/dateUtils';
import { Inside } from '@/util/inferTypes';

import ViewTimeline from './ViewTimeline';

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

export default function ViewEvents() {
  // date picker state
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [days, setDays] = useState(7);
  const endDate = useMemo(
    () =>
      dayjs(startDate)
        .add(days - 1, 'days')
        .toDate(),
    [days, startDate],
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

  function updatePeriod(d: number) {
    setStartDate(new Date(dateTSLocal(d) * 1000));
  }

  const props: CalendarProps = {
    events,
    days,
    dates: parsedDates,
    updatePeriod,
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* control bar */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2">
            <DateInput
              aria-label="start date"
              firstDayOfWeek={0}
              classNames={{
                levelsGroup: 'popover:border-slate-300 popover:shadow-sm',
                day: dayStyles,
              }}
              value={startDate}
              onChange={(nv) => nv && setStartDate(nv)}
            />
            <NumberInput
              aria-label="days"
              min={1}
              max={10}
              value={days}
              onChange={(v) => typeof v === 'number' && setDays(v)}
              className="w-[8ch]"
            />
          </div>
          <div className="flex flex-row gap-2">
            <ActionIcon
              aria-label="previous period"
              onClick={() => updatePeriod(parsedDates.start - D1 * days)}
              color="slate"
              variant="light"
              size="sm"
            >
              <IconArrowLeft />
            </ActionIcon>
            <ActionIcon
              aria-label="today"
              onClick={() => {
                let today = dayjs.unix(dateTS(new Date())).utc();
                if (days === 7) today = today.subtract(today.day(), 'days');
                updatePeriod(today.unix());
              }}
              color="slate"
              variant="light"
              size="sm"
            >
              <IconCalendar />
            </ActionIcon>
            <ActionIcon
              aria-label="previous period"
              onClick={() => updatePeriod(parsedDates.start + D1 * days)}
              color="slate"
              variant="light"
              size="sm"
            >
              <IconArrowRight />
            </ActionIcon>
          </div>
        </div>

        <hr />

        {/* timeline view */}
        <ViewTimeline {...props} />

        <hr />
      </div>
    </>
  );
}

export type CalendarProps = {
  events: EventType[] | undefined;
  days: number;
  dates: {
    start: number;
    end: number;
  };
  updatePeriod: (d: number) => void;
};
