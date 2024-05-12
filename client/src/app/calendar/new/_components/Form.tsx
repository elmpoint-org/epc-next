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

import FormCalendar from './FormCalendar';
import FormGuestRows from './FormGuestRows';
import { guestInitial, useFormCtx, type GuestEntry } from '../state/formCtx';

const COST_MEMBERS = 15.0;
const COST_GUESTS = 20.0;
export const MAX_ROOMS = 20;

const NewEventForm = () => {
  const { dates, guests, setGuests } = useFormCtx();

  // CALENDAR STATE
  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days') + 1;
    return Number.isFinite(d) ? Math.abs(d) : 0;
  }, [dates]);

  // ROOMS STATE
  const updateNumGuests = (nv: number | string) => {
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
        ...Array(nr - guests.length).fill(guestInitial()),
      ]);
    }
  };

  // EVENT NAME STATE
  const eventNameGuess = useMemo(() => {
    const count = guests.slice(1).reduce((total, { name: guest }) => {
      const m = guest.match(/(?:(.+), )*(.+)(?:,? and | & | \+ )(.+)/);
      let n = guest.length ? 1 : 0;
      if (m) n = m.slice(1).filter((item) => item !== undefined).length;
      return total + n;
    }, 1);
    return `${guests[0].name}${count > 1 ? ` + ${count - 1}` : ``}`;
  }, [guests]);

  return (
    <>
      <div className="m-6 mx-auto max-w-3xl p-4 md:p-6">
        <form action="#" className="space-y-4">
          {/* DATE ENTRY */}
          <FormCalendar />

          {/* ROOMS / PRICE */}
          <div className="flex flex-row items-center justify-between pb-4 pt-8">
            <NumberInput
              label="Rooms"
              value={guests.length}
              onChange={updateNumGuests}
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
          <FormGuestRows />

          {/* EVENT DETAILS */}
          <div className="flex flex-row gap-2">
            <TextInput
              label="Calendar Event Name"
              value={eventNameGuess}
              className="flex-1"
            />
            <ActionIcon disabled className="mt-7" variant="light">
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
