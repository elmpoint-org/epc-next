import { useMemo, useState } from 'react';

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

import { dateFormat, useDatesArray } from '../_util/dateUtils';
import { CalendarProps, EventType } from './ViewEvents';
import { clmx, clx } from '@/util/classConcat';
import { IconTypeProps } from '@/util/iconType';
import { Children } from '@/util/propTypes';

import EventPopup from './EventPopup';
import { alphabetical } from '@/util/sort';

export default function Agenda({ ...props }: CalendarProps) {
  const { events: events_in } = props;

  // get days per event
  const dates = useDatesArray(props);
  const eventsByDay = useMemo(() => {
    if (!events_in) return null;
    const events = events_in.sort(alphabetical((s) => s.title));
    return dates.map((d) => {
      const ad = {
        date: d,
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
      <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-4 py-2">
        {eventsByDay?.map((d) => (
          <div key={d.date} className="flex flex-col gap-2">
            {/* title bar */}
            <div className="border-y border-dblack px-2 py-1">
              {dateFormat(d.date, 'dddd M/D')}
            </div>

            <div className="grid grid-cols-[min-content_1fr] gap-x-4 gap-y-2 px-4">
              {/* arriving */}
              {d.arrivals.map((event) => (
                <>
                  <StatusIcon status="PLUS" />
                  <AgendaEvent event={event}>{event.title}</AgendaEvent>
                </>
              ))}

              {/* leaving */}
              {d.departures.map((event) => (
                <>
                  <StatusIcon status="MINUS" />
                  <AgendaEvent event={event}> {event.title}</AgendaEvent>
                </>
              ))}

              {/* unchanged */}
              <UnchangedEvents events={d.unchanged} noChanges={d.noChanges} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const subtleBtnStyles = clx(
  '-mx-2 -my-0.5 rounded-md px-2 py-0.5 hover:bg-slate-200/50 focus:bg-slate-200 focus:outline-none',
);

function AgendaEvent({ event, children }: { event: EventType } & Children) {
  return (
    <Popover>
      <PopoverButton className={clmx(subtleBtnStyles)}>
        {children}
      </PopoverButton>
      <EventPopup event={event} to="bottom start" />
    </Popover>
  );
}

function UnchangedEvents({
  events,
  noChanges,
}: {
  events: EventType[];
  noChanges?: boolean;
}) {
  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      {/* unchanged overview */}
      <StatusIcon status={isOpen ? 'DOWN' : 'DOT'} />
      <div>
        <button
          className={clmx(subtleBtnStyles)}
          onClick={() => setisOpen((b) => !b)}
        >
          {events.length}
          {!noChanges && ' others'} are here
        </button>
      </div>

      {/* unchanged events */}
      <Transition show={isOpen}>
        {events.map((event) => (
          <TransitionChild key={event.id}>
            <div className="col-span-full mt-0 grid grid-cols-subgrid duration-200 data-[closed]:-mt-8 data-[closed]:opacity-0">
              <StatusIcon status="DOT" />
              <AgendaEvent event={event}>{event.title}</AgendaEvent>
            </div>
          </TransitionChild>
        ))}
      </Transition>
    </>
  );
}

function StatusIcon({ status }: { status: 'PLUS' | 'MINUS' | 'DOT' | 'DOWN' }) {
  const props: IconTypeProps = { size: 20 };

  return (
    <div
      className={clx(
        'flex flex-row items-center',
        status === 'PLUS' && 'text-purple-700',
        status === 'MINUS' && 'text-sky-700',
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
