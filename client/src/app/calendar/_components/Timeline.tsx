import { ForwardedRef, forwardRef, useMemo } from 'react';

import { ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Transition } from '@headlessui/react';

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

  const byRoom = false;
  const roomsWidth = byRoom ? '14rem' : '0';

  const { initialOptions: rootCabins } = useGetRooms();

  return (
    <>
      <div className="flex flex-row gap-4">
        {/* events area */}
        <div className="flex flex-1 flex-col gap-2">
          <hr className="border-slate-300" />
          <div className="relative flex min-h-96 flex-col">
            {/* divider lines */}
            <div
              className="absolute inset-0 grid divide-x divide-slate-300"
              style={{ gridTemplateColumns, left: roomsWidth }}
            >
              {dates.map((_, i) => (
                <div key={i} className="col-span-2" />
              ))}
            </div>

            {/* header */}
            <div className="z-50 flex flex-row">
              <TimelineHeaderFrame placeholderWidth={roomsWidth} />
              <TimelineHeader {...props} />
            </div>

            {/* events grid */}
            <div className="z-40 flex flex-col">
              {/* show by room */}
              {byRoom &&
                rootCabins.map((rc) => (
                  <RoomRow
                    key={rc.id}
                    roomOrCabin={rc}
                    width={roomsWidth}
                    {...props}
                  />
                ))}
              {/* show disorganized */}
              {!byRoom && <EventsRow {...props} />}
            </div>
          </div>
          {!byRoom && <hr className="border-slate-300" />}
        </div>
      </div>
    </>
  );
}

type RoomRowProps = {
  roomOrCabin: Room | Cabin;
  width?: string;
  fr?: ForwardedRef<HTMLDivElement>;
} & CalendarProps;
function RoomRow({ roomOrCabin, width, fr, ...props }: RoomRowProps) {
  const cr = roomOrCabin;
  const isCabin = !('beds' in cr);

  const { rooms } = useGetRooms();

  const [isOpen, { toggle }] = useDisclosure();

  const RoomRowFR = forwardRef<HTMLDivElement, RoomRowProps>((props, fr) => (
    <RoomRow {...props} fr={fr} />
  ));
  RoomRowFR.displayName = 'RoomRowFR';

  if (roomOrCabin.name === ANY_ROOM) return null;

  return (
    <>
      <div
        ref={fr}
        className={clx(
          'flex flex-row border-y border-dashed border-slate-300/75 *:p-2',
          'transition data-[closed]:opacity-0',
        )}
      >
        {/* title section */}
        <div
          className="border-r border-slate-400 *:h-[2.375rem]"
          style={{ width }}
        >
          {isCabin ? (
            // CABIN TITLE
            <div className="flex flex-row items-center gap-2">
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
        <div className="flex-1">
          {!isCabin && <EventsRow roomId={cr.id} {...props} />}
        </div>
      </div>

      {/* child rooms */}
      {isCabin &&
        rooms
          .filter((r) => r.cabin?.id === cr.id)
          .map((r) => (
            <Transition key={r.id} show={isOpen}>
              <div className="t">
                <RoomRowFR roomOrCabin={r} width={width} {...props} />
              </div>
            </Transition>
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
          <TimelineEvent key={event.id} event={event} {...props} />
        ))}
      </div>
    </>
  );
}
