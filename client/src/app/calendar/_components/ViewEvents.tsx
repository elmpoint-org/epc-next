'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { NumberInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';

import { dayStyles } from '../_util/dayStyles';
import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { dateTS } from '../_util/dateUtils';

export default function ViewEvents() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [days, setDays] = useState(7);

  const endDate = useMemo(
    () => dayjs(startDate).add(days, 'days').toDate(),
    [days, startDate],
  );

  const query = useGraphQuery(
    graphql(`
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
    `),
    {
      start: dateTS(startDate),
      end: dateTS(endDate),
    },
  );

  // const events = query.data?.stays;
  const events: { title: string; author: { name: string } }[] = [];

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
            value={days}
            onChange={(v) => typeof v === 'number' && setDays(v)}
            className="w-[8ch]"
          />
        </div>

        <span>
          showing from {showDate(startDate)} to {showDate(endDate)}
        </span>

        <hr />

        {/* events */}
        <div className="flex flex-col rounded-lg border border-slate-300 p-4">
          {events?.map((evt, i) => (
            <div key={i} className="t">
              <p>{evt.title}</p>
              <p>{evt.author?.name}</p>
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

function showDate(d: Date) {
  return (
    <span className="-my-1 rounded-md bg-slate-300 p-1 font-bold">
      {dayjs(d).format('YYYY-MM-DD')}
    </span>
  );
}
