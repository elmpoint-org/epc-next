'use client';

import {
  ForwardedRef,
  Fragment,
  forwardRef,
  useCallback,
  useState,
} from 'react';

import { Popover, PopoverButton, Transition } from '@headlessui/react';
import {
  IconArrowBarBoth,
  IconChevronDown,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconPoint,
} from '@tabler/icons-react';

import { dateFormat } from '@epc/date-ts';
import { UseDatesArrayProps } from '../_util/datesArray';
import { CalendarProps, EventType } from './Calendar';
import { clmx, clx } from '@/util/classConcat';
import { IconTypeProps } from '@/util/iconType';
import { useEventColorId } from '../_util/cabinColorHooks';
import { useEventsByDay } from '../_util/eventsByDay';

import EventPopup from './EventPopup';
import RoomSwatch from './RoomSwatch';

// COMPONENT
type AgendaProps = Pick<CalendarProps, 'events' | 'updatePeriod'> &
  UseDatesArrayProps;
export default function Agenda({ ...props }: AgendaProps) {
  const { updatePeriod } = props;

  // get days per event
  const eventsByDay = useEventsByDay(props);

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
                    <StatusIcon status="ARRIVING" />
                    <AgendaEvent event={event} />
                  </Fragment>
                ))}

                {/* leaving */}
                {d.departures.map((event) => (
                  <Fragment key={event.id}>
                    <StatusIcon status="LEAVING" />
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
        <StatusIcon status={isOpen ? 'DROPDOWN' : 'STAYING'} />
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
            {!!events.length && !isOpen && (
              <IconChevronRight className="mb-px ml-1 inline size-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* unchanged events */}
      {events.map((event) => (
        <Transition key={event.id} show={isOpen}>
          <div className="col-span-full mt-0 grid grid-cols-subgrid duration-200 data-[closed]:-mt-8 data-[closed]:opacity-0">
            <StatusIcon status="STAYING" />
            <AgendaEvent event={event} />
          </div>
        </Transition>
      ))}
    </>
  );
}

type AgendaEventProps = {
  event: EventType;
  fr?: ForwardedRef<HTMLButtonElement>;
} & React.ComponentPropsWithoutRef<'button'>;
export const AgendaEvent = forwardRef<HTMLButtonElement, AgendaEventProps>(
  (p, r) => <AgendaEventFR {...p} fr={r} />,
);
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

type StatusType = 'ARRIVING' | 'LEAVING' | 'STAYING' | 'DROPDOWN' | 'DOT';
function StatusIcon({ status }: { status: StatusType }) {
  const props: IconTypeProps = { size: 20 };

  return (
    <div
      className={clmx(
        'mt-0.5 flex flex-row text-slate-400',
        status === 'ARRIVING' && 'text-emerald-900',
        status === 'LEAVING' && 'text-red-900',
      )}
    >
      {status === 'ARRIVING' && <IconPlus {...props} />}
      {status === 'LEAVING' && <IconMinus {...props} />}
      {status === 'STAYING' && <IconArrowBarBoth {...props} />}
      {status === 'DROPDOWN' && <IconChevronDown {...props} />}
      {status === 'DOT' && <IconPoint {...props} />}
    </div>
  );
}
