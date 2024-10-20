import { useEffect, useMemo, useState } from 'react';

import { ScrollArea } from '@mantine/core';
import { IconLoader2 } from '@tabler/icons-react';

import { D1, dateFormat, dateTS, dateTSObject } from '../_util/dateUtils';
import { CalendarProps, EventType } from './Calendar';
import { useEventsByDay } from '../_util/eventsByDay';
import { clmx, clx } from '@/util/classConcat';
import { useEventColorId, useEventColorIds } from '../_util/cabinColors';
import { alphabetical } from '@/util/sort';

import TimelineHeader from './TimelineHeader';
import TimelineEvent from './TimelineEvent';
import RoomSwatch from './RoomSwatch';

// date settings that lead to a Sun-Sat week for header values
const WEEK_HEADER = {
  dates: { start: 1725148800, end: 0 },
  days: 7,
} satisfies Partial<CalendarProps>;

export const OVERVIEW_NUM_WEEKS = 6;

// COMPONENT
export default function Overview({ ...props }: CalendarProps) {
  const {
    events,
    isLoading,
    selectedDate: firstOfMonth,
    dates: queryDates,
  } = props;

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  useEffect(() => {
    if (
      selectedDate &&
      (selectedDate < queryDates.start || selectedDate >= queryDates.end)
    )
      setSelectedDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDates]);

  const colorIds = useEventColorIds(events ?? []);

  // calculate dates
  const eventsByDay = useEventsByDay(
    {
      events,
      dates: queryDates,
      days: 7 * OVERVIEW_NUM_WEEKS,
    },
    (d) => {
      return {
        ...d,
        isSelected: d.date === selectedDate,
        isToday: d.date === dateTS(new Date()),
        inMonth:
          dateTSObject(d.date).month() === dateTSObject(firstOfMonth).month(),
        events: [...d.unchanged, ...d.arrivals].sort(
          alphabetical((d) => colorIds?.[d.id] ?? 'zzz'),
        ),
      };
    },
    true,
  );

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return null;
    return events?.filter(
      (event) =>
        event.dateStart <= selectedDate && event.dateEnd >= selectedDate,
    );
  }, [events, selectedDate]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative flex flex-col gap-4 md:flex-row">
          {/* CALENDAR */}
          <div className="flex flex-1 flex-col">
            <hr className="mb-2 border-slate-300" />

            {/* header */}
            <div className="sticky top-2 z-50 flex flex-row after:absolute after:inset-x-0 after:-top-2 after:h-2 after:bg-dwhite">
              <TimelineHeader noDate {...WEEK_HEADER} />
            </div>

            {/* calendar days */}
            <div className="-mx-1 pl-px">
              <div
                className="grid grid-flow-row grid-cols-7 gap-px bg-slate-300"
                style={{
                  gridTemplateRows: `repeat(${OVERVIEW_NUM_WEEKS}, minmax(0, 1fr));`,
                }}
              >
                {eventsByDay?.map((d) => (
                  // single day
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    data-nm={!d.inMonth || null}
                    className={clmx(
                      'group flex h-12 flex-col items-stretch gap-2 bg-dwhite p-4 sm:h-24',
                      /* out of month */ 'data-[nm]:bg-slate-100/80',
                    )}
                  >
                    {/* day number */}
                    <div className="flex flex-row justify-between">
                      <span
                        className={clmx(
                          '-m-2 flex size-7 items-center justify-center rounded-full text-xs transition group-hover:bg-slate-300/50 md:mb-0',
                          !d.inMonth && 'text-slate-600',
                          d.isSelected &&
                            'bg-slate-600 text-dwhite group-hover:bg-slate-700',
                          d.isToday &&
                            'bg-emerald-700 text-dwhite group-hover:bg-emerald-800',
                          d.isSelected && d.isToday && 'ring-4 ring-slate-400',
                        )}
                      >
                        {dateFormat(d.date, 'D')}
                      </span>
                    </div>

                    {/* event swatches */}
                    <div className="flex flex-row flex-wrap gap-1 overflow-hidden">
                      {d.events.map((event) => (
                        <OverviewSwatch key={event.id} event={event} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SELECTED DAY PANEL */}
          <div className="md:w-72" />
          <div
            className={clx(
              'relative rounded-lg border border-slate-300',
              /* full screen */ 'md:absolute md:inset-y-0 md:right-0 md:w-72 ',
            )}
          >
            {/* selected day */}
            {selectedDate && (
              <div className="inset-0 flex min-h-72 flex-col gap-4 p-4 md:absolute">
                {/* selected date */}
                <h3 className="text-center text-lg">
                  {dateFormat(selectedDate, 'MMM D, YYYY')}
                </h3>
                <hr className="mb-2 border-slate-300" />

                {/* events */}
                <ScrollArea
                  offsetScrollbars="y"
                  scrollbarSize="0.75rem"
                  classNames={{
                    root: '-mr-4',
                    scrollbar: 'mr-0.5 !bg-transparent',
                    viewport: 'pr-4',
                  }}
                >
                  <div className="relative grid grid-flow-row-dense grid-cols-2 gap-2">
                    {selectedEvents?.map((event) => (
                      // regular events
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        dates={{ start: selectedDate, end: selectedDate + D1 }}
                        days={1}
                      />
                    ))}
                  </div>

                  {/* loader */}
                  {isLoading && !selectedEvents && (
                    <div className="mb-2 flex flex-row justify-center">
                      <IconLoader2 className="animate-spin text-slate-400" />
                    </div>
                  )}

                  {/* no events message */}
                  {selectedEvents && !selectedEvents.length && (
                    <div className="text-center italic text-slate-600">
                      no events
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}

            {/* no day selected */}
            <div className="inset-0 hidden flex-col items-center justify-center p-4 text-center font-bold text-slate-400/80 first:flex md:absolute">
              select a day
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function OverviewSwatch({ event }: { event: EventType }) {
  const colorId = useEventColorId(event);

  return (
    <>
      <RoomSwatch
        cabinOrRoomId={colorId}
        withDefault
        className="saturate-75 size-1 sm:size-2"
      />

      {/* plus sign if it can ever be easily implemented... */}
      {/* <div className="size-2 rounded-full bg-slate-400">
        <span className="group-last:">+</span>
      </div> */}
    </>
  );
}