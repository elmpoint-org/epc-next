import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import { ScrollArea, Button, ActionIcon, Tooltip } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconSortAscending,
} from '@tabler/icons-react';

import { UseState } from '@/util/stateType';
import { CalendarProps } from './Calendar';
import { clx } from '@/util/classConcat';
import { D1, dateFormat } from '@epc/date-ts';
import { CalendarControlsProps, useCalendarControls } from '../_util/controls';
import { alphabetical } from '@/util/sort';

import TimelineEvent from './TimelineEvent';

type OverviewDayProps = {
  selected: UseState<number | null>;
} & Pick<CalendarProps, 'events' | 'isLoading' | 'updatePeriod'> &
  CalendarControlsProps;

export default function OverviewDay({
  selected: [selectedDate, setSelectedDate],
  ...props
}: OverviewDayProps) {
  const { events, isLoading, updatePeriod } = props;

  // get events

  const [sortBy, setSortBy] = useState<'DATE' | 'CABIN'>('DATE');
  const selectedEvents = useMemo(() => {
    if (!selectedDate) return null;
    let evs = events?.filter(
      (event) =>
        event.dateStart <= selectedDate && event.dateEnd >= selectedDate,
    );

    if (sortBy === 'CABIN')
      evs?.sort(
        alphabetical((it) => {
          const r = it.reservations?.[0]?.room;
          if (r && 'id' in r) return r.cabin?.name ?? 'zzzz' + r.name;
          return '';
        }),
      );
    return evs;
  }, [events, selectedDate, sortBy]);

  // controls

  const { showWeekOf } = useCalendarControls(props);
  const showWeekURL = useMemo(() => {
    if (!selectedDate) return null;
    const url = showWeekOf(selectedDate, true);
    return url;
  }, [selectedDate, showWeekOf]);

  const changeSelectedDay = useCallback(
    (delta_days: number) => {
      let d = selectedDate ?? 0;
      d = d + delta_days * D1;
      setSelectedDate(d);
      updatePeriod(d);
    },
    [selectedDate, setSelectedDate, updatePeriod],
  );

  return (
    <>
      <div className="md:w-72" />
      <div
        className={clx(
          'relative rounded-lg border border-slate-300',
          /* full screen */ 'hidden md:absolute md:inset-y-0 md:right-0 md:block md:w-72',
        )}
      >
        {/* selected day */}
        {selectedDate && (
          <div className="inset-0 flex min-h-72 flex-col gap-4 p-4 md:absolute">
            {/* section header */}
            <div className="flex flex-row justify-between gap-2">
              {/* last */}
              <ActionIcon
                variant="transparent"
                color="slate"
                onClick={() => changeSelectedDay(-1)}
              >
                <IconChevronLeft />
              </ActionIcon>

              {/* selected date */}
              <h3 className="text-center text-lg">
                {dateFormat(selectedDate, 'ddd MMM D, YYYY')}
              </h3>

              {/* next */}
              <ActionIcon
                variant="transparent"
                color="slate"
                onClick={() => changeSelectedDay(1)}
              >
                <IconChevronRight />
              </ActionIcon>
            </div>
            <hr className="mb-2 border-slate-300" />

            {/* events */}
            <ScrollArea
              scrollbars="y"
              offsetScrollbars="y"
              scrollbarSize="0.75rem"
              classNames={{
                root: '-mr-4 flex-1',
                scrollbar: 'mr-0.5 !bg-transparent',
                viewport: 'pr-4',
              }}
            >
              <div className="relative grid grid-cols-1">
                <div className="flex flex-col gap-2">
                  {selectedEvents?.map((event) => (
                    // regular events
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      dates={{ start: selectedDate, end: selectedDate }}
                      days={1}
                      edgeOffset
                    />
                  ))}
                </div>
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
                  no stays
                </div>
              )}
            </ScrollArea>

            <div className="flex flex-row items-center gap-2">
              <Button
                component={Link}
                href={showWeekURL ?? '#'}
                variant="light"
                className="flex-1 space-x-2"
              >
                <span>Show full week</span>
                <IconChevronRight className="mt-0.5 inline size-4" />
              </Button>
              {/* sort order */}
              <Tooltip
                label={`Sort by ${sortBy === 'CABIN' ? 'date' : 'cabin'}`}
              >
                <ActionIcon
                  variant={sortBy === 'CABIN' ? 'filled' : 'light'}
                  size="lg"
                  onClick={() =>
                    setSortBy((s) => (s === 'CABIN' ? 'DATE' : 'CABIN'))
                  }
                >
                  <IconSortAscending />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>
        )}

        {/* no day selected */}
        <div className="inset-0 hidden flex-col items-center justify-center p-4 text-center font-bold text-slate-400/80 first:flex md:absolute">
          <div className="t">
            <IconChevronLeft className="mr-2 hidden md:inline" />
            <span>
              click on a day
              <span className="inline md:hidden">&hellip;</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
