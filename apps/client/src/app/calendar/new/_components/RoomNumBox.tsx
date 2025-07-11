import { NumberInput } from '@mantine/core';

import { MAX_ROOMS } from './NewEventForm';
import { guestInitial, useFormCtx } from '../state/formCtx';
import { useCallback } from 'react';

const RoomNumBox = () => {
  const { guests, setGuests } = useFormCtx();

  const updateNumGuests = useCallback(
    (nv: number | string) => {
      const nr = parseInt('' + nv);
      if (!Number.isFinite(nr)) return;
      if (nr <= 0 || nr > MAX_ROOMS) return;
      if (guests.length > nr) {
        if (
          guests.slice(nr).filter((r) => r.name.length || r.room.room).length &&
          !confirm(
            'Are you sure you want to reduce the number of rooms? Any information in the removed rows will be lost.',
          )
        )
          return;

        setGuests((o) => o.slice(0, nr));
      } else {
        setGuests((o) => [
          ...o,
          ...Array(nr - guests.length)
            .fill(0)
            .map(guestInitial),
        ]);
      }
    },
    [guests, setGuests],
  );

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4 pt-8">
        <NumberInput
          label="Rooms"
          value={guests.length}
          onChange={updateNumGuests}
          min={1}
          max={MAX_ROOMS}
          size="sm"
          classNames={{
            root: '-mt-6 w-16',
            input: 'pr-8 text-center',
          }}
        />

        <div className="text-right text-sm text-slate-600">
          List attendees below, <b className="font-semibold">one row per bed</b>
          .<br />
          The top row determines event color.
        </div>
      </div>
    </>
  );
};
export default RoomNumBox;
