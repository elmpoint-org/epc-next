import { clmx } from '@/util/classConcat';
import { D1, dateFormat } from '@epc/date-ts';
import { CalendarProps } from './Calendar';
import {
  useEventsByDayInMonth,
  UseEventsByDayInMonthProps,
} from '../_util/eventsByDay';
import { UseState } from '@/util/stateType';

import { OVERVIEW_NUM_WEEKS } from '@/CONSTANTS';
import TimelineHeader from './TimelineHeader';

// date settings that lead to a Sun-Sat week for header values
export const WEEK_HEADER = {
  dates: { start: 1725148800, end: 0 },
  days: 7,
} satisfies Partial<CalendarProps>;

const TEMP_BANNERS = Array.from({ length: OVERVIEW_NUM_WEEKS }).map(() =>
  [
    [1, 4],
    [4, 8],
    [8, 12],
    [12, 15],
    [2, 6],
    [6, 10],
    [10, 14],
    [1, 5],
    [5, 8],
    [10, 14],
    [4, 6],
    [8, 12],
    [11, 15],
    [2, 8],
    [8, 14],
    [1, 8],
    [8, 12],
    [2, 8],
    [8, 15],
    [4, 10],
    [10, 14],
    [6, 12],
    [12, 15],
    [6, 12],
    [1, 6],
    [6, 12],
    [12, 15],
    [2, 8],
    [8, 14],
    [4, 8],
    [8, 15],
    [4, 10],
    [10, 14],
    [4, 12],
    [12, 15],
  ].sort(() => Math.random() - 0.5),
);

// COMPONENT
type OverviewCalendarProps = {
  selected: UseState<number | null>;
} & Pick<CalendarProps, 'updatePeriod' | 'dates'> &
  UseEventsByDayInMonthProps;
export default function OverviewCalendar({
  selected: [selectedDate, setSelectedDate],
  ...props
}: OverviewCalendarProps) {
  const { updatePeriod, dates: queryDates } = props;

  // calculate dates
  const eventsByDay = useEventsByDayInMonth({
    ...props,
    days: 7 * OVERVIEW_NUM_WEEKS,
    currentlySelected: selectedDate ?? undefined,
  });

  return (
    <>
      <div className="flex flex-1 flex-col">
        <hr className="mb-2 border-slate-300" />

        {/* header */}
        <div className="sticky top-2 z-50 flex flex-row after:absolute after:inset-x-0 after:-top-2 after:h-2 after:bg-dwhite">
          <TimelineHeader noDate {...WEEK_HEADER} />
        </div>

        {/* calendar days */}
        <div className="-mx-1 flex flex-1 flex-col pl-px">
          <div
            className="grid flex-1 grid-flow-row grid-cols-7 gap-px bg-slate-300"
            style={{
              gridTemplateRows: `repeat(${OVERVIEW_NUM_WEEKS}, minmax(0, 1fr))`,
            }}
          >
            {Array(OVERVIEW_NUM_WEEKS)
              .fill(0)
              .map((_, week) => (
                <div
                  key={week}
                  className="relative col-span-full grid grid-cols-subgrid"
                >
                  {/* DAYS */}
                  {eventsByDay
                    ?.filter(
                      ({ date }) =>
                        date >= queryDates.start + D1 * week * 7 &&
                        date < queryDates.start + D1 * (week + 1) * 7,
                    )
                    .map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        onDoubleClick={() => updatePeriod(d.date)}
                        data-nm={!d.inMonth || null}
                        className={clmx(
                          'group flex flex-col items-stretch gap-2 bg-dwhite p-0.5 focus:outline-none',
                          /* out of month */ 'data-[nm]:bg-dwhite/80',
                        )}
                      >
                        {/* day number */}
                        <div className="flex flex-row justify-center">
                          <div
                            className={clmx(
                              'flex w-4 items-center justify-center rounded-sm p-0.5 text-[0.675rem]/none transition group-hover:bg-slate-300/50 group-focus:bg-slate-300/50',
                              !d.inMonth && 'text-slate-600',
                              d.isSelected &&
                                'bg-slate-600 text-dwhite group-hover:bg-slate-700 group-focus:bg-slate-700',
                              d.isToday &&
                                'bg-emerald-600/10 font-bold text-dgreen',
                              d.isSelected &&
                                d.isToday &&
                                'bg-dgreen text-dwhite',
                            )}
                          >
                            {dateFormat(d.date, 'D')}
                          </div>
                        </div>
                      </button>
                    ))}

                  {/* EVENTS */}
                  <div className="pointer-events-none absolute inset-0 grid grid-flow-row-dense grid-cols-[repeat(14,minmax(0,1fr))] grid-rows-7 gap-[2px] py-1">
                    <div className="col-span-full" />

                    {TEMP_BANNERS[week].map(([a, b], i) => (
                      <div
                        key={i}
                        className="rounded-sm bg-emerald-600"
                        style={{ gridColumn: `${a} / ${b}` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
