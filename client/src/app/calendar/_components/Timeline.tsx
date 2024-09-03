import { Fragment, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { theme } from '@/util/tailwindVars';
import { LayoutGroup, motion } from 'framer-motion';

import { D1, useDatesArray } from '../_util/dateUtils';
import { CalendarProps } from './ViewEvents';
import { gridCols } from '../_util/grid';
import { Cabin, Room, useGetRooms } from '../new/state/getRoomData';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';

import TimelineHeader, { TimelineHeaderFrame } from './TimelineHeader';
import TimelineEvent, { EventPlaceholder } from './TimelineEvent';
import RoomSwatch from './RoomSwatch';
import { useDisplayByRooms } from '../_util/displayByRooms';

export default function Timeline(props: CalendarProps) {
  const { days } = props;

  // ctx hooks
  const dates = useDatesArray(props);
  const gridTemplateColumns = gridCols(days);

  // get byRoom option
  const [displayByRoom] = useDisplayByRooms();

  // prep cabin sidebar
  const { initialOptions: rootCabins } = useGetRooms();
  const sidebarWidth = displayByRoom ? '14rem' : '0';

  return (
    <>
      <div
        className="group/tm flex flex-row gap-4"
        data-d={displayByRoom || null}
      >
        {/* events area */}
        <div className="flex flex-1 flex-col gap-2">
          <hr className="border-slate-300" />
          <LayoutGroup>
            <div className="relative flex min-h-96 flex-col">
              {/* divider lines */}
              <div
                className="absolute inset-0 -mx-1 grid divide-x divide-slate-300 group-data-[d]/tm:ml-1"
                style={{ gridTemplateColumns, left: sidebarWidth }}
              >
                {dates.map((_, i) => (
                  <div key={i} className="col-span-2" />
                ))}
              </div>

              {/* header */}
              <div className="sticky top-2 z-50 flex flex-row after:absolute after:inset-x-0 after:-top-2 after:h-2 after:bg-dwhite">
                <TimelineHeaderFrame placeholderWidth={sidebarWidth} />
                {displayByRoom && (
                  <TimelineHeaderFrame placeholderWidth="0.5rem" noDivider />
                )}
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
                {displayByRoom && (
                  <>
                    {/* room rows */}
                    {rootCabins.map((rc) => (
                      <RoomEventsRow
                        key={rc.id}
                        roomOrCabin={rc}
                        width={sidebarWidth}
                        {...props}
                      />
                    ))}

                    {/* no room  */}
                    <RoomEventsRow
                      roomOrCabin={null}
                      width={sidebarWidth}
                      {...props}
                    />
                  </>
                )}
                {/* show disorganized */}
                {!displayByRoom && <EventsGrid {...props} />}
              </div>
            </div>
          </LayoutGroup>

          <hr className="border-slate-300" />
        </div>
      </div>
    </>
  );
}

function RoomEventsRow({
  roomOrCabin,
  width,
  ...props
}: {
  roomOrCabin: Room | Cabin | null;
  width?: string;
} & CalendarProps) {
  const { roomCollapse } = props;
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = useMemo(() => {
    if (roomCollapse.state === 'OPEN') {
      setLocalOpen(true);
      return true;
    }
    if (roomCollapse.state === 'CLOSED') {
      setLocalOpen(false);
      return false;
    }
    return localOpen;
  }, [localOpen, roomCollapse.state]);
  function open() {
    roomCollapse.set('MIXED');
    setLocalOpen(true);
  }
  function toggle() {
    roomCollapse.set('MIXED');
    setLocalOpen((s) => !s);
  }

  const cr = roomOrCabin;

  const { rooms } = useGetRooms();

  const isCabin = cr && !('beds' in cr);
  const isRootRoom = cr && 'beds' in cr && cr.cabin === null;

  // offset for collapsed cabins
  const namesOffset = useMemo(() => Math.random() * 32, []);

  return (
    <>
      <motion.div
        layout
        className="group flex flex-row gap-2"
        style={
          isCabin || isRootRoom || cr === null
            ? ({
                '--row-color': '#eef2f7',
              } as React.CSSProperties)
            : undefined
        }
        data-c={isCabin || isRootRoom || cr === null || null}
        data-r={(!isCabin && !isRootRoom && cr !== null) || null}
      >
        {/* title section */}
        <div className="flex flex-row gap-2" style={{ width }}>
          <div className="flex-1 border-t border-dashed border-slate-300/60 p-2 *:h-[2.375rem] group-first:!border-transparent group-data-[c]:border-solid group-data-[c]:border-slate-300">
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
                <div className="flex flex-row items-center gap-2">
                  <RoomSwatch cabinOrRoomId={cr.id} />
                  <span>{cr.name}</span>
                </div>
              </div>
            ) : (
              // ROOM TITLE
              <div
                className="flex flex-row items-center rounded-md transition duration-200 group-hover:font-bold"
                data-hb={!isRootRoom || null} // hover bg
              >
                <div
                  className="mr-4 flex w-8 flex-row items-center data-[r]:hidden"
                  data-r={!isCabin || null}
                />
                <div className="flex flex-1 flex-row items-center gap-2">
                  <RoomSwatch cabinOrRoomId={cr?.id} />
                  <span>
                    {cr?.name !== ANY_ROOM ? (
                      cr?.name ?? (
                        <span className="text-sm !font-normal">
                          No room data
                        </span>
                      )
                    ) : (
                      <em>no room</em>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* right divider */}
          <div className="flex-shrink-0 border-r border-slate-400" />
        </div>

        {/* events */}
        <div className="flex flex-1 flex-row border-t border-dashed border-slate-300/60 py-2 group-first:!border-transparent group-data-[c]:border-solid group-data-[c]:border-slate-300 group-data-[r]:bg-slate-200/25">
          {/* show events in room */}
          {!isCabin && (
            <EventsGrid roomId={cr?.id} noRoom={cr === null} {...props} />
          )}

          {/* show collapsed events in cabin */}
          {isCabin && !isOpen && (
            <EventsGrid cabinId={cr.id} {...props} onOpen={open} />
          )}

          {/* names marquis when cabin is open */}
          {isCabin && isOpen && (
            <div className="relative flex-1">
              <div
                className="absolute inset-0 -inset-y-2 flex select-none flex-row items-center gap-8 overflow-hidden bg-dwhite/80 px-4 text-sm text-slate-400 md:gap-24 xl:gap-48 xl:px-12"
                style={{ marginLeft: `${namesOffset}px` }}
              >
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      layout
                      animate={{ opacity: 1 }}
                      key={i}
                      className="-mx-1 whitespace-nowrap px-1 opacity-0"
                    >
                      {cr.name}
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

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
  noRoom,
  onOpen,
  ...props
}: {
  roomId?: string;
  cabinId?: string;
  noRoom?: boolean;
  onOpen?: () => void;
} & CalendarProps) {
  const { events: events_in, days, dates } = props;

  const events = useMemo(() => {
    // filter for norooms if requested
    if (noRoom)
      return events_in?.filter(
        (evt) =>
          !evt.reservations.filter((r) => r.room && 'id' in r.room).length,
      );

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
  }, [cabinId, events_in, noRoom, roomId]);

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
          if (last.combined < matches.length) last.combined = matches.length;
          continue;
        }
      }

      // OTHERWISE, make new entry
      placeholders.push({
        eventId: matches.length === 1 ? matches[0].id : undefined,
        combined: matches.length > 1 ? matches.length : 0,
        start:
          !placeholders.length && t === dates.start && matches[0]?.dateStart < t
            ? t - D1
            : t,
        end:
          t === dates.end && matches[0]?.dateEnd > t + D1 ? t + 2 * D1 : t + D1,
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
                theme={p.combined ? 'NATIVE' : undefined}
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
