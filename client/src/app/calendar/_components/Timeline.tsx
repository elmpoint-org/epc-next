import { ForwardedRef, Fragment, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

import { useDatesArray } from '../_util/dateUtils';
import { CalendarProps } from './ViewEvents';
import { gridCols } from '../_util/grid';
import { Cabin, Room, useGetRooms } from '../new/state/getRoomData';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';
import { clx } from '@/util/classConcat';

import TimelineHeader, { TimelineHeaderFrame } from './TimelineHeader';
import TimelineEvent from './TimelineEvent';

export default function Timeline(props: CalendarProps) {
  const { days } = props;

  // ctx hooks
  const dates = useDatesArray(props);
  const gridTemplateColumns = gridCols(days);

  // get byRoom option
  const sq = useSearchParams();
  const router = useRouter();
  const SQ_BYROOM = 'rooms';
  const displayByRoom = useMemo(() => {
    const str = sq.get(SQ_BYROOM);
    return str === 'true' || str === '1';
  }, [sq]);
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
      <div className="flex flex-row">
        <button onClick={() => setDisplayByRoom(!displayByRoom)}>toggle</button>
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
            <div className="z-50 flex flex-row">
              <TimelineHeaderFrame placeholderWidth={sidebarWidth} />
              <TimelineHeader {...props} />
            </div>

            {/* events grid */}
            <div className="z-40 flex flex-col">
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
              {!displayByRoom && <EventsRow {...props} />}
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
  const isCabin = !('beds' in cr);

  const { rooms } = useGetRooms();

  const [isOpen, { toggle }] = useDisclosure(true);

  if (roomOrCabin.name === ANY_ROOM) return null;

  return (
    <>
      <div
        ref={fr}
        className={clx(
          'group flex flex-row border-dashed border-slate-300/75 *:p-2',
          'transition data-[closed]:opacity-0',
        )}
      >
        {/* title section */}
        <div
          className="border-r border-t border-r-slate-400 border-t-slate-300/75 [border-top-style:dashed] *:h-[2.375rem] group-first:border-t-transparent"
          style={{ width }}
        >
          {isCabin ? (
            // CABIN TITLE
            <div className="flex flex-row items-center gap-2" onClick={toggle}>
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
            <div className="flex flex-row items-center">
              <div
                className="mr-4 flex w-6 flex-row items-center data-[r]:hidden"
                data-r={!cr.cabin || null}
              />
              <div className="flex-1">{cr.name}</div>
            </div>
          )}
        </div>

        {/* events */}
        <div className="flex-1 border-t border-dashed border-slate-300/75 group-first:border-transparent">
          {!isCabin && <EventsRow roomId={cr.id} {...props} />}
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

function EventsRow({ roomId, ...props }: { roomId?: string } & CalendarProps) {
  const { events: events_in, days } = props;

  const events = useMemo(() => {
    if (!roomId?.length) return events_in;
    return events_in?.filter((evt) =>
      evt.reservations.some(
        (r) => r.room && 'id' in r.room && r.room.id === roomId,
      ),
    );
  }, [events_in, roomId]);

  const gridTemplateColumns = gridCols(days);

  return (
    <>
      <div
        className="grid flex-1 grid-flow-row-dense auto-rows-fr gap-2"
        style={{ gridTemplateColumns }}
      >
        {events?.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            highlightRoom={roomId}
            {...props}
          />
        ))}
      </div>
    </>
  );
}
