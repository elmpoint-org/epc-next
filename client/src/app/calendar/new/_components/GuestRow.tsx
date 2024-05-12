import { useEffect, useRef } from 'react';

import { Button, TextInput, Tooltip } from '@mantine/core';
import { IconArrowBarToUp, IconTrash } from '@tabler/icons-react';

import { MAX_ROOMS, type Room, type RoomUpdateFn } from './Form';
import ActionButton from './ActionButton';
import RoomSelector from './RoomSelector';

const GuestRow = ({
  rooms,
  updateRoom,
}: {
  rooms: Room[];
  updateRoom: RoomUpdateFn;
}) => {
  // handle keyboard shortcuts
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const focusInput = (i: number) =>
      (document.querySelector(`#guest-name-${i}`) as HTMLInputElement)?.focus();

    const dom = domRef.current;
    if (!dom) return;
    const cb = (e: KeyboardEvent) => {
      const m = ((e.target as any)?.id as string)?.match(/^guest-name-(\d+)/);
      if (m) {
        const i = parseInt(m[1]);
        switch (e.code) {
          case 'ArrowUp':
            e.preventDefault();
            focusInput(i - 1);
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (i === rooms.length - 1) updateRoom(rooms.length, 'CREATE');
            focusInput(i + 1);
            break;
          case 'Backspace':
            if (!rooms[i].guest.length) {
              e.preventDefault();
              updateRoom(i, 'DELETE');
              focusInput(i - 1);
            }
            break;
        }
      }
    };

    // attach event listener
    dom.addEventListener('keydown', cb);
    return () => dom.removeEventListener('keydown', cb);
  });

  return (
    <>
      <div ref={domRef} className="space-y-2">
        {/* room entry */}
        {rooms.map((room, i) => (
          <div
            key={i}
            className="relative flex flex-col items-stretch gap-7 rounded-xl border border-slate-300 p-4 pt-10 sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:px-0 sm:py-4"
          >
            {/* number */}
            <div className="absolute bottom-4 left-5 w-[2ch] select-none p-0.5 text-left text-sm text-slate-500 sm:static sm:p-0 sm:text-right">
              {i + 1}
            </div>
            {/* guest name */}
            <TextInput
              id={`guest-name-${i}`}
              label={`Name of ${!i ? 'Primary ' : ''}Guest(s)`}
              className="-mt-5 flex-1"
              classNames={{
                input:'h-10'
              }}
              value={room.guest}
              onChange={({ currentTarget: { value } }) =>
                updateRoom(i, 'UPDATE', { guest: value })
              }
            />

            {/* room select */}
            <div className="flex-1">
              <RoomSelector className="-mt-5" />
            </div>
            {/* action buttons */}
            <div className="mr-3 flex flex-row justify-end gap-2 sm:justify-normal">
              {/* make primary */}
              <Tooltip label="Make this the primary guest">
                <ActionButton
                  Icon={IconArrowBarToUp}
                  onClick={() => updateRoom(i, 'MAKE_PRIMARY')}
                  disabled={!i}
                />
              </Tooltip>
              {/* delete */}
              <Tooltip label="Delete row">
                <ActionButton
                  Icon={IconTrash}
                  onClick={() => updateRoom(i, 'DELETE')}
                />
              </Tooltip>
            </div>
          </div>
        ))}
        {/* add room button */}
        <div className="flex flex-row items-center py-2 sm:py-0">
          <div className="flex flex-1 flex-row items-center gap-3">
            <div className="w-[2ch] select-none text-right text-sm text-slate-500 sm:static">
              +
            </div>
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() => updateRoom(rooms.length, 'CREATE')}
              disabled={rooms.length >= MAX_ROOMS}
            >
              Add room
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestRow;
