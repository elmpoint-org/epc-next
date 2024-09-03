import { ForwardedRef, Fragment, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuid } from 'uuid';

import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { breakpoints, theme } from '@/util/tailwindVars';

import { D1, useDatesArray } from '../_util/dateUtils';
import { CalendarProps } from './ViewEvents';
import { gridCols } from '../_util/grid';
import { Cabin, Room, useGetRooms } from '../new/state/getRoomData';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';

import TimelineHeader, { TimelineHeaderFrame } from './TimelineHeader';
import TimelineEvent, { EventPlaceholder } from './TimelineEvent';
import { useWindowSize } from '@uidotdev/usehooks';

export default function Timeline(props: CalendarProps) {
  const { days } = props;

  // ctx hooks
  const dates = useDatesArray(props);
  const gridTemplateColumns = gridCols(days);

  // get byRoom option
  const windowSize = useWindowSize();
  const sq = useSearchParams();
  const router = useRouter();
  const SQ_BYROOM = 'rooms';
  const displayByRoom = useMemo(() => {
    if (windowSize.width && windowSize.width < breakpoints('sm')) return false;
    const str = sq.get(SQ_BYROOM);
    return str === 'true' || str === '1';
  }, [sq, windowSize.width]);
  function setDisplayByRoom(nv: boolean) {
    const query = new URLSearchParams(sq);
    query.set(SQ_BYROOM, nv ? '1' : '0');
    router.push('?' + query.toString(), { scroll: false });
  }

  // prep cabin sidebar
  const { initialOptions: rootCabins } = useGetRooms();
  const sidebarWidth = displayByRoom ? '14rem' : '0';

  return (
    <>
      {/* // TODO delete */}
      <div className="absolute inset-x-0 -top-2 hidden flex-row justify-center sm:flex">
        <button onClick={() => setDisplayByRoom(!displayByRoom)}>view</button>
      </div>

      <div className="flex flex-row gap-4">
        {/* events area */}
        <div className="flex flex-1 flex-col gap-2">
          <hr className="border-slate-300" />
          <div className="relative flex min-h-96 flex-col">
            {/* divider lines */}
            <div
              className="absolute inset-0 grid divide-x divide-slate-300"
              style={{ gridTemplateColumns, left: sidebarWidth }}
            >
              {dates.map((_, i) => (
                <div key={i} className="col-span-2" />
              ))}
            </div>

            {/* header */}
            <div className="sticky top-2 z-50 flex flex-row after:absolute after:inset-x-0 after:-top-2 after:h-2 after:bg-dwhite">
              <TimelineHeaderFrame placeholderWidth={sidebarWidth} />
              <TimelineHeader {...props} />
            </div>

            {/* events grid */}
            <div
              className="z-40 flex flex-col"
              style={
                { '--row-color': theme.colors.dwhite } as React.CSSProperties
              }
            >
              {/* show by room */}
              {displayByRoom &&
                rootCabins.map((rc) => (
                  <RoomEventsRow
                    key={rc.id}
                    roomOrCabin={rc}
                    width={sidebarWidth}
                    {...props}
                  />
                ))}
              {/* show disorganized */}
              {!displayByRoom && <EventsGrid {...props} />}
            </div>
          </div>
          {!displayByRoom && <hr className="border-slate-300" />}
        </div>
      </div>
    </>
  );
}

function RoomEventsRow({
  roomOrCabin,
  width,
  fr,
  ...props
}: {
  roomOrCabin: Room | Cabin;
  width?: string;
  fr?: ForwardedRef<HTMLDivElement>;
} & CalendarProps) {
  const cr = roomOrCabin;

  const { rooms } = useGetRooms();

  const [isOpen, { toggle, open }] = useDisclosure();
  const isCabin = !('beds' in cr);
  const isRootRoom = 'beds' in cr && cr.cabin === null;

  // offset for collapsed cabins
  const namesOffset = useMemo(() => Math.random() * 32, []);

  return (
    <>
      <div
        ref={fr}
        className="_data-[r]:bg-slate-200/25 group flex flex-row *:p-2"
        style={
          isCabin || isRootRoom
            ? ({
                '--row-color': '#eef2f7',
              } as React.CSSProperties)
            : undefined
        }
        data-c={isCabin || isRootRoom || null}
        data-r={(!isCabin && !isRootRoom) || null}
      >
        {/* title section */}
        <div
          className="border-r border-t border-r-slate-400 border-t-slate-300/75 [border-top-style:dashed] *:h-[2.375rem] group-first:!border-t-transparent group-data-[c]:border-t-slate-400"
          style={{ width }}
        >
          {isCabin ? (
            // CABIN TITLE
            <div
              className="flex cursor-pointer flex-row items-center gap-2 group-hover:font-bold"
              onClick={toggle}
            >
              <ActionIcon
                size="sm"
                color="slate"
                variant="subtle"
                onClick={toggle}
              >
                {isOpen ? <IconChevronDown /> : <IconChevronRight />}
              </ActionIcon>
              <div className="">{cr.name}</div>
            </div>
          ) : (
            // ROOM TITLE
            <div
              className="flex flex-row items-center rounded-md transition duration-200 group-hover:font-bold"
              data-hb={!isRootRoom || null} // hover bg
            >
              <div
                className="mr-4 flex w-8 flex-row items-center data-[r]:hidden"
                data-r={!cr.cabin || null}
              />
              <div className="flex-1">
                {cr.name !== ANY_ROOM ? cr.name : <em>(no room)</em>}
              </div>
            </div>
          )}
        </div>

        {/* events */}
        <div className="flex flex-1 flex-row border-t border-dashed border-slate-300/75 group-first:!border-transparent group-data-[c]:border-slate-400 group-data-[r]:bg-slate-200/25">
          {/* show events in room */}
          {!isCabin && <EventsGrid roomId={cr.id} {...props} />}

          {/* show collapsed events in cabin */}
          {isCabin && !isOpen && (
            <EventsGrid cabinId={cr.id} {...props} onOpen={open} />
          )}

          {/* names marquis when cabin is open */}
          {isCabin && isOpen && (
            <div className="relative flex-1">
              <div
                className="absolute inset-0 flex select-none flex-row items-center gap-8 overflow-hidden px-4 text-sm text-slate-400 md:gap-24 xl:gap-48 xl:px-12"
                style={{ marginLeft: `${namesOffset}px` }}
              >
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="-mx-1 whitespace-nowrap bg-dwhite/90 px-1 py-0.5"
                    >
                      {cr.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* child rooms */}
      {isCabin &&
        rooms
          .filter((r) => r.cabin?.id === cr.id)
          .map((r) => (
            <Fragment key={r.id}>
              {isOpen && (
                <RoomEventsRow roomOrCabin={r} width={width} {...props} />
              )}
            </Fragment>
          ))}
    </>
  );
}

function EventsGrid({
  roomId,
  cabinId,
  onOpen,
  ...props
}: { roomId?: string; cabinId?: string; onOpen?: () => void } & CalendarProps) {
  const { events: events_in, days, dates } = props;

  const events = useMemo(() => {
    // filter for cabin overview
    if (cabinId)
      return events_in?.filter((evt) =>
        evt.reservations.some(
          (r) => r.room && 'id' in r.room && r.room.cabin?.id === cabinId,
        ),
      );

    // filter for single room
    if (!roomId?.length) return events_in;
    return events_in?.filter((evt) =>
      evt.reservations.some(
        (r) => r.room && 'id' in r.room && r.room.id === roomId,
      ),
    );
  }, [cabinId, events_in, roomId]);

  // COLLAPSED PLACEHOLDERS
  const cabinPlaceholders = useMemo(() => {
    let placeholders: EventPlaceholder[] = [];
    if (!events?.length) return placeholders;

    // check every day
    for (let t = dates.start - D1; t <= dates.end; t += D1) {
      // find events today
      const matches = events.filter((r) => r.dateStart <= t && r.dateEnd > t);

      // simple cases (extend existing entry if possible)
      const last = placeholders.at(-1);
      if (matches.length === 0) {
        continue;
      } else if (matches.length === 1) {
        if (last && last.eventId === matches[0].id) {
          last.end = t + D1;
          continue;
        }
      } else {
        if (last && last?.combined && last.end === t) {
          last.end = t + D1;
          continue;
        }
      }

      // OTHERWISE, make new entry
      placeholders.push({
        eventId: matches.length === 1 ? matches[0].id : undefined,
        combined: matches.length > 1,
        start:
          !placeholders.length && t === dates.start && matches[0]?.dateStart < t
            ? t - D1
            : t,
        end:
          t + D1 === dates.end && matches[0]?.dateEnd > t + D1
            ? t + 2 * D1
            : t + D1,
      });
    }

    return placeholders;
  }, [dates, events]);

  const gridTemplateColumns = gridCols(days);

  return (
    <>
      <div
        className="grid flex-1 grid-flow-row-dense auto-rows-fr gap-2"
        style={{ gridTemplateColumns }}
      >
        {!cabinId
          ? events?.map((event) => (
              // regular events
              <TimelineEvent
                key={event.id}
                event={event}
                highlightRoom={roomId}
                {...props}
              />
            ))
          : cabinPlaceholders.map((p, i) => (
              // collapsed events
              <TimelineEvent
                key={i}
                placeholder={p}
                onOpen={onOpen}
                theme={p.combined ? 'GRAY' : undefined}
                event={
                  (p.eventId?.length &&
                    events?.find((it) => it.id === p.eventId)) || {
                    id: uuid(),
                    dateStart: 0,
                    dateEnd: 0,
                    reservations: [],
                    author: null,
                    description: '',
                    title: '',
                  }
                }
                {...props}
              />
            ))}
      </div>
    </>
  );
}
