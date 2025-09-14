import { useCallback, useEffect, useMemo, useRef } from 'react';

import { Button, TextInput, Tooltip } from '@mantine/core';
import { IconArrowBarToUp, IconTrash } from '@tabler/icons-react';

import ActionButton from './ActionButton';
import RoomSelector from './RoomSelector';
import { GuestEntry, guestInitial, useFormCtx } from '../state/formCtx';

import { MAX_ROOMS } from './NewEventForm';
import { dateDiff, dateTS } from '@epc/date-ts';

const FormGuestRows = () => {
  const { guests, setGuests } = useFormCtx();

  const updateRoom = useCallback(
    (
      i: number,
      action: 'CREATE' | 'UPDATE' | 'MAKE_PRIMARY' | 'DELETE',
      updates?: Partial<GuestEntry> | null,
    ) => {
      const nr = [...guests];

      switch (action) {
        case 'CREATE':
          nr[i] = { ...guestInitial() };
          break;
        case 'UPDATE':
          nr[i] = { ...nr[i], ...updates };
          break;
        case 'MAKE_PRIMARY':
          const [el] = nr.splice(i, 1);
          nr.unshift(el);
          break;
        case 'DELETE':
          nr.splice(i, 1);
          break;
      }
      if (!nr.length) nr.push(guestInitial());

      setGuests(nr);
    },
    [guests, setGuests],
  );

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
            if (i === guests.length - 1) updateRoom(guests.length, 'CREATE');
            focusInput(i + 1);
            break;
          case 'Backspace':
            if (!guests[i].name.length && !guests[i].room.room) {
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
        {guests.map((room, i) => (
          <div
            key={i}
            className="relative flex flex-col items-stretch gap-7 rounded-xl border border-slate-300 p-4 pt-10 @xl:flex-row @xl:items-end @xl:gap-3 @xl:border-0 @xl:px-0 @xl:py-4"
          >
            {/* number */}
            <div className="absolute bottom-4 left-5 w-[2ch] p-0.5 text-left text-sm text-slate-500 select-none @xl:static @xl:p-0 @xl:py-2.5 @xl:text-right">
              {i + 1}
            </div>
            {/* guest name */}
            <TextInput
              id={`guest-name-${i}`}
              label={`Name of Visitor(s)`}
              placeholder="Enter a name"
              className="-mt-5 flex-1"
              classNames={{
                input: 'h-10',
              }}
              value={room.name}
              onChange={({ currentTarget: { value } }) =>
                updateRoom(i, 'UPDATE', { name: value })
              }
            />

            {/* room select */}
            <div className="relative flex-1 @xl:max-w-[50%]">
              <RoomSelector rowIndex={i} className="-mt-5" />
            </div>
            {/* action buttons */}
            <div className="mr-3 flex flex-row justify-end gap-2 @xl:h-10 @xl:items-center @xl:justify-normal">
              {/* make primary */}
              <Tooltip label="Move to top">
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
        <div className="flex flex-row items-center py-2 @xl:py-0">
          <div className="flex flex-1 flex-row items-center gap-3">
            <div className="w-[2ch] text-right text-sm text-slate-500 select-none @xl:static">
              +
            </div>
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() => updateRoom(guests.length, 'CREATE')}
              disabled={guests.length >= MAX_ROOMS}
            >
              Add room
            </Button>
          </div>
          <EventRoomsTableLink />
        </div>
      </div>
    </>
  );
};

export default FormGuestRows;

function EventRoomsTableLink() {
  const { dates } = useFormCtx();

  const params = useMemo(() => {
    if (dates[0] === null || dates[1] === null) return null;
    const dateTSs = [dateTS(dates[0]), dateTS(dates[1])];
    const days = dateDiff(dateTSs[1], dateTSs[0]) + 1;
    return { start: dateTSs[0], days };
  }, [dates]);

  return (
    <a
      href={`/calendar?view=TIMELINE&rooms=1&days=${params?.days}&date=${params?.start}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mr-2 hidden cursor-pointer text-xs text-slate-500 italic hover:text-slate-700 hover:underline data-h:hidden sm:block"
      data-h={params === null || null}
    >
      View these dates in Rooms Table &nbsp;&#x2197;
    </a>
  );
}
