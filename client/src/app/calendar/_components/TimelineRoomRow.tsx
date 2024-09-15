import { Fragment, lazy, useMemo, useState } from 'react';

import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { CalendarProps } from './Calendar';
import { Cabin, Room, useGetRooms } from '../new/state/getRoomData';
import { ANY_ROOM } from '@@/db/schema/Room/CABIN_DATA';

import RoomSwatch from './RoomSwatch';

const TimelineEventsGrid = lazy(() => import('./TimelineEventsGrid'));

export default function TimelineRoomRow({
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
          <div className="flex-1 border-t border-dashed border-slate-300/60 p-2 *:h-[1.875rem] group-first:!border-transparent group-data-[c]:border-solid group-data-[c]:border-slate-300">
            {isCabin ? (
              // CABIN TITLE
              <div
                className="flex cursor-pointer flex-row items-center gap-2 group-hover:font-bold"
                onClick={toggle}
              >
                <ActionIcon
                  aria-label="toggle expand cabin"
                  size="sm"
                  color="slate"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
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
                      <em>any room</em>
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
            <TimelineEventsGrid
              roomId={cr?.id}
              noRoom={cr === null}
              {...props}
            />
          )}

          {/* show collapsed events in cabin */}
          {isCabin && !isOpen && (
            <TimelineEventsGrid cabinId={cr.id} {...props} onOpen={open} />
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
                <TimelineRoomRow roomOrCabin={r} width={width} {...props} />
              )}
            </Fragment>
          ))}
    </>
  );
}
