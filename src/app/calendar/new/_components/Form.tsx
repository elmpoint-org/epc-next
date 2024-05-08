'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { useForm } from '@mantine/form';
import { Button, NumberInput, TextInput, Textarea } from '@mantine/core';

import Calendar from './Calendar';
import RoomSelects from './RoomSelects';

const COST_MEMBERS = 15.0;
const COST_GUESTS = 20.0;
const MAX_ROOMS = 20;

const NewEventForm = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);

  const [numRooms, setNumRooms] = useState(1);

  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days') + 1;
    return Number.isFinite(d) ? d : 0;
  }, [dates]);

  const updateNumRooms = (nv: number | string) => {
    const nr = parseInt('' + nv);
    if (!Number.isFinite(nr)) return;
    if (nr <= 0 || nr > MAX_ROOMS) return;
    if (
      numRooms - nr > 3 &&
      !confirm(
        'Are you sure you want to reduce the number of rooms? Any information in the removed rows will be lost.',
      )
    )
      return;

    setNumRooms(nr);
  };

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
              value={numRooms}
              onChange={updateNumRooms}
              min={1}
              max={MAX_ROOMS}
              size="sm"
              classNames={{
                root: 'w-16 -mt-6',
                input: 'text-right pr-8',
              }}
            />

            <p className="text-sm text-slate-600">
              {diff} day{diff !== 1 && 's'} - ${diff * COST_MEMBERS}/member - $
              {diff * COST_GUESTS}/guest
            </p>
          </div>

          {/* ROOM SELECTION */}
          <RoomSelects numRooms={numRooms} />

          {/* EVENT DETAILS */}
          <TextInput label="Event Name" />
          <Textarea label="Event Description" />

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
