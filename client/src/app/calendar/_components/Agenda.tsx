'use client';

import {
  ForwardedRef,
  Fragment,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Popover,
  PopoverButton,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import {
  IconChevronDown,
  IconMinus,
  IconPlus,
  IconPoint,
} from '@tabler/icons-react';

import {
  UseDatesArrayProps,
  dateFormat,
  useDatesArray,
} from '../_util/dateUtils';
import { CalendarProps, EventType } from './ViewEvents';
import { clmx, clx } from '@/util/classConcat';
import { IconTypeProps } from '@/util/iconType';
import { alphabetical } from '@/util/sort';
import { useEventColorId } from '../_util/cabinColors';

import EventPopup from './EventPopup';
import RoomSwatch from './RoomSwatch';

// COMPONENT
type AgendaProps = Pick<CalendarProps, 'events' | 'updatePeriod'> &
  UseDatesArrayProps;
export default function Agenda({ ...props }: AgendaProps) {
  const { events: events_in, updatePeriod } = props;

  // get days per event
  const dates = useDatesArray(props);
  const eventsByDay = useMemo<EventsByDay[] | null>(() => {
    if (!events_in) return null;
    const events = events_in.sort(alphabetical((s) => s.title));
    return dates.map((d) => {
      const ad = {
        date: d,
        count: events.filter(
          (event) => event.dateStart <= d && event.dateEnd >= d,
        ).length,
        arrivals: events.filter((event) => event.dateStart === d),
        departures: events.filter((event) => event.dateEnd === d),
      };
      return {
        ...ad,
        unchanged: events.filter(
          (event) =>
            event.dateStart <= d &&
            event.dateEnd > d &&
            !ad.arrivals.find((it) => it.id === event.id) &&
            !ad.departures.find((it) => it.id === event.id),
        ),
        noChanges: !ad.arrivals.length && !ad.departures.length,
      };
    });
  }, [dates, events_in]);

  return (
    <>
      <div className="mx-auto my-4 flex w-full max-w-screen-lg flex-col gap-4 py-2 peer-hover/d:bg-red-500">
        {eventsByDay?.map((d, i) => {
          const isParent =
            d.noChanges &&
            (!i || !eventsByDay[i - 1].noChanges) &&
            eventsByDay[i + 1]?.noChanges;
          const hide =
            !!i && d.noChanges && !isParent && eventsByDay[i - 1].noChanges;

          let nd;
          if (isParent) {
            for (const d of eventsByDay.slice(i)) {
              if (!d.noChanges) break;
              nd = d;
            }
          }

          return (
            <div
              key={d.date}
              className="flex flex-col gap-2 data-[h]:hidden"
              data-h={hide || null}
            >
              {/* title bar */}
              <div className="flex flex-row justify-between border-y border-dblack px-2 py-1">
                <button onClick={() => updatePeriod(d.date)}>
                  <span>{dateFormat(d.date, 'dddd M/D')}</span>
                  {nd && (
                    <span>
                      <span className="mx-2 text-slate-400">–</span>
                      {dateFormat(nd.date, 'dddd M/D')}
                    </span>
                  )}
                </button>
                <div className="text-slate-500">
                  <span className="font-bold">{d.count}</span>
                  <span className="hidden sm:inline"> total</span>
                </div>
              </div>

              <div className="grid grid-cols-[min-content_1fr] gap-x-4 gap-y-2 px-4">
                {/* arriving */}
                {d.arrivals.map((event) => (
                  <Fragment key={event.id}>
                    <StatusIcon status="PLUS" />
                    <AgendaEvent event={event} />
                  </Fragment>
                ))}

                {/* leaving */}
                {d.departures.map((event) => (
                  <Fragment key={event.id}>
                    <StatusIcon status="MINUS" />
                    <AgendaEvent event={event} />
                  </Fragment>
                ))}

                {/* unchanged */}
                <UnchangedEvents events={d.unchanged} noChanges={d.noChanges} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

type EventsByDay = {
  date: number;
  count: number;
  noChanges: boolean;
  arrivals: EventType[];
  departures: EventType[];
  unchanged: EventType[];
};

const subtleBtnStyles = clx(
  '-mx-2 -my-0.5 rounded-md px-2 py-0.5 text-left focus:bg-slate-200 focus:outline-none hover:enabled:bg-slate-200/50',
);

// -------------------------------------

function UnchangedEvents({
  events,
  noChanges,
}: {
  events: EventType[];
  noChanges?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => {
    if (events.length) setIsOpen((b) => !b);
    else setIsOpen(false);
  }, [events.length]);

  return (
    <>
      {/* unchanged overview */}
      <div
        className={clmx(
          'col-span-full grid grid-cols-subgrid',
          !events.length && 'hidden first:grid',
        )}
      >
        <StatusIcon status={isOpen ? 'DOWN' : 'DOT'} />
        <div>
          <button
            className={clmx(subtleBtnStyles)}
            onClick={toggle}
            disabled={!events.length}
          >
            <span className="mr-0.5 font-bold text-slate-600">
              {events.length}
            </span>
            <span>{!noChanges && ' more'}</span>
            <span> {events.length === 1 ? 'is' : 'are'} here</span>
          </button>
        </div>
      </div>

      {/* unchanged events */}
      <Transition show={isOpen}>
        {events.map((event) => (
          <TransitionChild key={event.id}>
            <div className="col-span-full mt-0 grid grid-cols-subgrid duration-200 data-[closed]:-mt-8 data-[closed]:opacity-0">
              <StatusIcon status="DOT" />
              <AgendaEvent event={event} />
            </div>
          </TransitionChild>
        ))}
        <></>
      </Transition>
    </>
  );
}

type AgendaEventProps = {
  event: EventType;
  fr?: ForwardedRef<HTMLButtonElement>;
} & React.ComponentPropsWithoutRef<'button'>;
const AgendaEvent = forwardRef<HTMLButtonElement, AgendaEventProps>((p, r) => (
  <AgendaEventFR {...p} fr={r} />
));
AgendaEvent.displayName = 'AgendaEvent';
function AgendaEventFR({ event, className, ...props }: AgendaEventProps) {
  const colorId = useEventColorId(event);
  return (
    <Popover>
      <PopoverButton
        className={clmx('flex flex-row gap-2', subtleBtnStyles, className)}
        {...props}
      >
        <div className="flex h-6 flex-row items-center">
          <RoomSwatch cabinOrRoomId={colorId} withDefault />
        </div>
        <span>{event.title}</span>
      </PopoverButton>
      <EventPopup event={event} to="bottom start" />
    </Popover>
  );
}

type StatusType = 'PLUS' | 'MINUS' | 'DOT' | 'DOWN';
function StatusIcon({ status }: { status: StatusType }) {
  const props: IconTypeProps = { size: 20 };

  return (
    <div
      className={clmx(
        'mt-0.5 flex flex-row',
        status === 'PLUS' && 'text-emerald-900',
        status === 'MINUS' && 'text-red-900',
        status === 'DOT' && 'text-slate-400',
        status === 'DOWN' && 'text-slate-400',
      )}
    >
      {status === 'PLUS' && <IconPlus {...props} />}
      {status === 'MINUS' && <IconMinus {...props} />}
      {status === 'DOT' && <IconPoint {...props} />}
      {status === 'DOWN' && <IconChevronDown {...props} />}
    </div>
  );
}
