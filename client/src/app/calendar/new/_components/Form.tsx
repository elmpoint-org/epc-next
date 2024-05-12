'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import {
  ActionIcon,
  Button,
  NumberInput,
  TextInput,
  Textarea,
} from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import Calendar from './Calendar';
import GuestRow from './GuestRow';

const COST_MEMBERS = 15.0;
const COST_GUESTS = 20.0;
export const MAX_ROOMS = 20;

export type Room = {
  guest: string;
  roomId: string;
};
export type RoomUpdateFn = (
  index: number,
  action: 'CREATE' | 'UPDATE' | 'MAKE_PRIMARY' | 'DELETE',
  updates?: Partial<Room> | null,
) => void;
const roomInitial: Room = {
  guest: '',
  roomId: '',
};

const NewEventForm = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days') + 1;
    return Number.isFinite(d) ? Math.abs(d) : 0;
  }, [dates]);

  const [rooms, setRooms] = useState([roomInitial]);
  const updateNumRooms = (nv: number | string) => {
    const nr = parseInt('' + nv);
    if (!Number.isFinite(nr)) return;
    if (nr <= 0 || nr > MAX_ROOMS) return;
    if (rooms.length > nr) {
      if (
        rooms.slice(nr).filter((r) => r.guest.length || r.roomId.length)
          .length &&
        !confirm(
          'Are you sure you want to reduce the number of rooms? Any information in the removed rows will be lost.',
        )
      )
        return;

      setRooms((o) => o.slice(0, nr));
    } else {
      setRooms((o) => [...o, ...Array(nr - rooms.length).fill(roomInitial)]);
    }
  };
  const updateRoom: RoomUpdateFn = (i, action, update) => {
    const nr = [...rooms];

    switch (action) {
      case 'CREATE':
        nr[i] = { ...roomInitial };
        break;
      case 'UPDATE':
        nr[i] = { ...nr[i], ...update };
        break;
      case 'MAKE_PRIMARY':
        const [el] = nr.splice(i, 1);
        nr.unshift(el);
        break;
      case 'DELETE':
        nr.splice(i, 1);
        break;
    }
    if (!nr.length) nr.push(roomInitial);

    setRooms(nr);
  };

  const eventNameGuess = useMemo(() => {
    const count = rooms.slice(1).reduce((total, { guest }) => {
      const m = guest.match(/(?:(.+), )*(.+)(?:,? and | & | \+ )(.+)/);
      let n = guest.length ? 1 : 0;
      if (m) n = m.slice(1).filter((item) => item !== undefined).length;
      return total + n;
    }, 1);
    return `${rooms[0].guest}${count > 1 ? ` + ${count - 1}` : ``}`;
  }, [rooms]);

  return (
    <>
      <div className="m-6 mx-auto max-w-3xl p-4 md:p-6">
        <form action="#" className="space-y-4">
          {/* DATE ENTRY */}
          <Calendar {...{ dates, setDates }} />

          {/* ROOMS / PRICE */}
          <div className="flex flex-row items-center justify-between pb-4 pt-8">
            <NumberInput
              label="Rooms"
              value={rooms.length}
              onChange={updateNumRooms}
              min={1}
              max={MAX_ROOMS}
              size="sm"
              classNames={{
                root: 'w-16 -mt-6',
                input: 'text-center pr-8',
              }}
            />

            <p className="text-sm text-slate-600">
              {diff} day{diff !== 1 && 's'} - ${diff * COST_MEMBERS}/member - $
              {diff * COST_GUESTS}/guest
            </p>
          </div>

          {/* ROOM SELECTION */}
          <GuestRow {...{ rooms, updateRoom }} />

          {/* EVENT DETAILS */}
          <div className="flex flex-row gap-2">
            <TextInput
              label="Calendar Event Name"
              value={eventNameGuess}
              className="flex-1"
            />
            <ActionIcon /* disabled */ className="mt-7" variant="light">
              <IconRestore />
            </ActionIcon>
          </div>
          <Textarea label="Calendar Event Description" />

          {/* SUBMIT */}
          <div className="flex flex-row">
            <div className="flex-1"></div>
            <Button type="submit" variant="light">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default NewEventForm;
