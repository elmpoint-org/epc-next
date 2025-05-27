'use client';

import { graphql } from '@/query/graphql';
import qs from 'qs';
import {
  CALENDAR_EVENT_FRAGMENT,
  EventType,
  InvalidateProvider,
} from '../../_components/Calendar';
import { useGraphQuery } from '@/query/query';
import { useUser } from '@/app/_ctx/user/context';
import { Popover, PopoverButton } from '@headlessui/react';
import EventPopup from '../../_components/EventPopup';
import { useMemo } from 'react';
import { dateFormat, dateTS, dateTSObject } from '../../_util/dateUtils';
import { IconCalendarShare, IconLoader2 } from '@tabler/icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import Link from 'next/link';

const EVENTS_QUERY = graphql(
  `
    query StaysFromAuthor($authorId: String!) {
      staysFromAuthor(authorId: $authorId) {
        ...CalendarEvent
      }
    }
  `,
  [CALENDAR_EVENT_FRAGMENT],
);

export default function MyEventsList() {
  const user = useUser();
  const query = useGraphQuery(EVENTS_QUERY, { authorId: user?.id ?? '' });

  const today = useMemo(() => dateTS(new Date()), []);

  const events = useMemo(
    () =>
      query.data?.staysFromAuthor
        .filter((ev) => ev.dateEnd >= today)
        .sort((a, b) => a.dateStart - b.dateStart),
    [query.data?.staysFromAuthor, today],
  );

  return (
    <div>
      {/* events list */}
      <div
        className="grid grid-cols-[min-content_1fr_min-content] divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 text-sm/6 data-[n]:border-transparent sm:mx-4"
        data-n={(!query.isPending && !events?.length) || null}
      >
        <InvalidateProvider cb={() => query.refetch()}>
          {events?.map((event) => <EventButton key={event.id} event={event} />)}
        </InvalidateProvider>

        {/* skeleton */}
        {query.isPending &&
          Array(3)
            .fill(0)
            .map((_, i) => <EventButton key={i} />)}

        {/* no reservations message */}
        {!query.isFetching && (
          <div className="col-span-full hidden flex-col items-center text-sm italic text-slate-600 first:flex">
            none found
          </div>
        )}
      </div>

      {/* loader */}
      {query.isFetching && !query.isPending && (
        <div className="my-6 flex flex-row items-center justify-center">
          <IconLoader2 className="animate-spin text-slate-400" />
        </div>
      )}
    </div>
  );
}

function EventButton({ event }: { event?: EventType }) {
  // get formatted dates, including the year only if needed
  const formattedDates = useMemo(() => {
    if (!event) return null;
    const de = dateTSObject(event.dateEnd);
    const withYear = de.year() !== new Date().getFullYear();
    const formats = withYear
      ? ['MMM D, YYYY', 'MMM D, YYYY']
      : ['ddd, MMM D', 'ddd, MMM D'];
    return [
      dateFormat(event.dateStart, formats[0]),
      dateFormat(event.dateEnd, formats[1]),
    ] as const;
  }, [event]);

  return (
    <Popover className="col-span-full grid grid-cols-subgrid">
      <PopoverButton
        className="col-span-full flex grid-cols-subgrid flex-row items-center gap-2 px-8 py-4 hover:bg-slate-200/25 focus:bg-slate-200/50 focus:outline-none sm:grid"
        disabled={!event}
      >
        <div
          className="col-span-2 flex flex-1 grid-cols-subgrid flex-col gap-2 truncate text-left data-[s]:py-0.5 sm:grid sm:items-center sm:gap-12"
          data-s={!event || null}
        >
          {/* dates */}
          <div className="flex flex-row items-center gap-2 text-nowrap text-xs text-slate-600 sm:text-sm">
            {event ? (
              <>
                <div>{formattedDates?.[0]}</div>
                <span className="text-slate-400">&ndash;</span>
                <div>{formattedDates?.[1]}</div>
              </>
            ) : (
              // skeleton
              <div className=" h-3 w-40 animate-pulse rounded-full bg-slate-200 sm:h-4" />
            )}
          </div>

          {/* event title */}
          {event ? (
            <>
              <div className="truncate">{event.title}</div>
            </>
          ) : (
            // skeleton
            <div className="my-1 mr-4 h-4 max-w-72 animate-pulse rounded-full bg-slate-200 text-sm sm:my-0" />
          )}
        </div>

        {/* show in calendar button */}
        {event ? (
          <Tooltip label="Show in calendar">
            <ActionIcon
              aria-label="Show in calendar"
              component={Link}
              href={`/calendar?${qs.stringify({
                view: 'TIMELINE',
                date: event.dateStart,
              })}`}
              variant="subtle"
              color="slate"
              size="sm"
              className="-mr-2"
            >
              <IconCalendarShare stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ) : (
          // skeleton
          <div className="-mr-2 size-6 animate-pulse rounded-md bg-slate-200" />
        )}
      </PopoverButton>
      {event && <EventPopup event={event} to="bottom start" />}
    </Popover>
  );
}
