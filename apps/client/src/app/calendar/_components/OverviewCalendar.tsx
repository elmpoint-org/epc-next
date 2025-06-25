import { clmx, clx } from '@/util/classConcat';
import { dateFormat, dateTS, dateTSObject } from '@epc/date-ts';
import { useEventColorId, useEventColorIds } from '../_util/cabinColorHooks';
import { CalendarProps, EventType } from './Calendar';
import { OVERVIEW_NUM_WEEKS } from './Overview';
import { useEventsByDay } from '../_util/eventsByDay';
import { alphabetical } from '@/util/sort';
import { UseState } from '@/util/stateType';

import RoomSwatch from './RoomSwatch';
import TimelineHeader from './TimelineHeader';

// date settings that lead to a Sun-Sat week for header values
const WEEK_HEADER = {
  dates: { start: 1725148800, end: 0 },
  days: 7,
} satisfies Partial<CalendarProps>;

type OverviewCalendarProps = {
  selected: UseState<number | null>;
} & Pick<CalendarProps, 'events' | 'selectedDate' | 'dates' | 'updatePeriod'>;

// COMPONENT
export default function OverviewCalendar({
  selected: [selectedDate, setSelectedDate],
  ...props
}: OverviewCalendarProps) {
  const {
    events,
    selectedDate: firstOfMonth,
    dates: queryDates,
    updatePeriod,
  } = props;

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
        events: [...d.unchanged, ...d.arrivals, ...d.departures]
          .reduce(
            (arr, cur) =>
              arr.some((e) => e.id === cur.id) ? arr : [...arr, cur],
            [] as EventType[],
          )
          .sort(alphabetical((d) => colorIds?.[d.id] ?? 'zzz')),
      };
    },
    true,
  );

  return (
    <>
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
              gridTemplateRows: `repeat(${OVERVIEW_NUM_WEEKS}, minmax(0, 1fr))`,
            }}
          >
            {eventsByDay?.map((d) => (
              // single day
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                onDoubleClick={() => updatePeriod(d.date)}
                data-nm={!d.inMonth || null}
                className={clmx(
                  'group flex h-12 flex-col items-stretch gap-2 bg-dwhite p-4 focus:outline-none sm:h-24',
                  /* out of month */ 'data-[nm]:bg-slate-100/80',
                )}
              >
                {/* day number */}
                <div className="flex flex-row justify-between">
                  <span
                    className={clmx(
                      '-m-2 flex size-7 items-center justify-center rounded-full text-xs transition group-hover:bg-slate-300/50 group-focus:bg-slate-300/50 md:mb-0',
                      !d.inMonth && 'text-slate-600',
                      d.isSelected &&
                        'bg-slate-600 text-dwhite group-hover:bg-slate-700 group-focus:bg-slate-700',
                      d.isToday && 'bg-emerald-600/10 font-bold text-dgreen',
                      d.isSelected && d.isToday && 'bg-dgreen text-dwhite',
                    )}
                  >
                    {dateFormat(d.date, 'D')}
                  </span>

                  {/* event count */}
                  <span
                    className={clx(
                      'text-nowrap text-right text-sm text-slate-400/90 sm:m-0 sm:-mr-2 sm:-mt-1 xl:mr-0',
                      /* mobile */ '-mr-1.5 mt-2',
                    )}
                  >
                    {/* <IconCalendarFilled className="-mt-0.5 mr-0.5 hidden size-3.5 xl:inline" /> */}
                    <span>{d.count}</span>
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
