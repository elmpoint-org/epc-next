'use client';

import { useMemo, useState } from 'react';

import { NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';

import { dayStyles } from '../_util/dayStyles';
import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { dateTS, dayjs, showDate } from '../_util/dateUtils';
import { clx } from '@/util/classConcat';
import ViewTimeline from './ViewTimeline';
import { ResultOf } from '@graphql-typed-document-node/core';
import { Inside } from '@/util/inferTypes';

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

  const props: CalendarProps = {
    events,
    days,
    dates: parsedDates,
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* date select */}
        <div className="flex flex-row gap-2">
          <DateInput
            label="start date"
            firstDayOfWeek={0}
            classNames={{
              levelsGroup: 'popover:border-slate-300 popover:shadow-sm',
              day: dayStyles,
            }}
            value={startDate}
            onChange={(nv) => nv && setStartDate(nv)}
          />
          <NumberInput
            label="days"
            min={1}
            max={7}
            value={days}
            onChange={(v) => typeof v === 'number' && setDays(v)}
            className="w-[8ch]"
          />
        </div>

        <span>
          showing from {showDate(parsedDates.start)} to{' '}
          {showDate(parsedDates.end)}
        </span>

        <hr />

        {/* timeline view */}
        <ViewTimeline {...props} />

        <hr />

        {/* events list */}
        <div className="flex flex-col rounded-lg bg-slate-200 p-4">
          {events?.map((evt, i) => (
            <div
              key={i}
              className={clx(
                'rounded-md bg-dwhite p-4 shadow-sm',
                /* em */ '[&_em]:font-bold [&_em]:not-italic [&_em]:text-slate-600',
              )}
            >
              <p>
                title: <em>{evt.title}</em>
              </p>
              <p>
                author: <em>{evt.author?.name}</em>
              </p>

              <p>
                dates: <em>{showDate(evt.dateStart)}</em> to{' '}
                <em>{showDate(evt.dateEnd)}</em>
              </p>

              <div className="t">
                <h4 className="t">reservations:</h4>
                <div className="flex flex-col gap-2 p-2">
                  {evt.reservations.map((res, i) => (
                    <div key={i} className="flex flex-row items-center gap-2">
                      <div className="t">{res.name}</div>
                      <div className="t">-</div>
                      {res.room &&
                        ('text' in res.room ? (
                          <>
                            <div className="italic">{res.room.text}</div>
                          </>
                        ) : (
                          <>
                            <div className="t">{res.room.name}</div>
                          </>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="hidden text-sm italic first:block">
            no events found.
          </div>
        </div>
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
};
