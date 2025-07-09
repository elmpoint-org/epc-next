import { Fragment, ReactNode, useCallback, useMemo } from 'react';
import {
  useEventsByDayInMonth,
  UseEventsByDayInMonthProps,
} from '../_util/eventsByDay';
import { CalendarProps, EventType } from './Calendar';
import { OVERVIEW_NUM_WEEKS } from './Overview';
import { D1, dateFormat } from '@epc/date-ts';
import { clmx, clx } from '@/util/classConcat';
import TimelineEvent from './TimelineEvent';
import TimelineHeader from './TimelineHeader';
import { WEEK_HEADER } from './OverviewCalendar';
import { Inside } from '@/util/inferTypes';

export default function Calcium(
  props: Pick<CalendarProps, never> & UseEventsByDayInMonthProps,
) {
  const {
    events,
    dates: { start: startDate },
  } = props;

  const eventsByDay = useEventsByDayInMonth(props);
  const eventsByWeek = useMemo<WeekOfEvents[] | null>(
    () =>
      (!!eventsByDay &&
        Array.from({ length: OVERVIEW_NUM_WEEKS }).map((_, i_week) => {
          const range = [
            startDate + D1 * 7 * i_week,
            startDate + D1 * 7 * (i_week + 1) - D1,
          ] as const;
          return {
            dateRange: range,
            days: Array.from({ length: 7 }).map(
              (_, i_day) => eventsByDay[i_week * 7 + i_day],
            ),
            events:
              events?.filter(
                (ev) => ev.dateEnd >= range[0] && ev.dateStart <= range[1],
              ) ?? [],
          };
        })) ||
      null,
    [events, eventsByDay, startDate],
  );

  return (
    <>
      <div className="flex flex-1 flex-col">
        <hr className="mb-2 border-slate-300" />

        {/* header */}
        <div className="sticky top-2 z-50 -mx-2 -mb-2 flex flex-row px-2 before:absolute before:inset-x-1 before:-top-2 before:bottom-2 before:-z-10 before:border-b before:border-slate-300 before:bg-dwhite">
          <TimelineHeader noDate {...WEEK_HEADER} />
        </div>

        <div className="-mr-1 ml-[calc(-.25rem+1px)] grid grid-cols-7 gap-px bg-slate-300">
          <WeekGrid {...{ eventsByWeek }} />
        </div>
      </div>
    </>
  );
}

type WeekOfEvents = {
  dateRange: readonly [number, number];
  days: DayOfWeekObject[];
  events: EventType[];
};
type DayOfWeekObject = Inside<ReturnType<typeof useEventsByDayInMonth>>;

function WeekGrid({ eventsByWeek }: { eventsByWeek: WeekOfEvents[] | null }) {
  return (
    <>
      {eventsByWeek?.map((week, iw) => (
        <Fragment key={iw}>
          {/* week bg */}
          <div
            className="col-span-full grid grid-cols-subgrid"
            style={{
              gridRowStart: iw + 1,
            }}
          >
            {week.days.map((d) => (
              <div
                key={d.date}
                className={clmx(
                  'border-slate-200 bg-dwhite print:border-b print:border-r',
                  !d.inMonth && 'bg-dwhite/80',
                )}
              />
            ))}
          </div>

          {/* week row */}
          <div
            key={iw}
            className="relative col-span-full grid grid-cols-subgrid"
            style={{
              gridRowStart: iw + 1,
            }}
          >
            {/* week days header */}
            <WeekHeader week={week} />

            {/* week's events grid */}
            <EventsInWeek week={week} />
          </div>
        </Fragment>
      ))}
    </>
  );
}

function EventsInWeek({ week }: { week: WeekOfEvents }) {
  return (
    <div
      className="col-span-full grid min-h-16 grid-flow-dense gap-1 py-1 [--row-color:rgb(241_245_249/.9)]"
      style={{
        gridTemplateColumns: `repeat(${14}, minmax(0, 1fr))`,
      }}
    >
      {week.events.map((event) => (
        <TimelineEvent
          key={event.id}
          event={event}
          days={7}
          dates={{
            start: week.dateRange[0],
            end: week.dateRange[1],
          }}
        />
      ))}
    </div>
  );
}

function WeekHeader({ week }: { week: WeekOfEvents }) {
  return (
    <>
      {week.days.map((day) => (
        <div
          key={day.date}
          data-nm={!day.inMonth || null}
          className="sticky flex flex-col items-center justify-center border-b border-slate-300/50 py-1"
        >
          <h3
            className={clx(
              '-my-0.5 rounded-md px-1 py-0.5 text-center text-sm/none',
              day.isToday && 'bg-emerald-500/25 font-bold text-emerald-900',
            )}
          >
            {dateFormat(day?.date, 'D')}
          </h3>
        </div>
      ))}
    </>
  );
}
