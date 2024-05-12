'use client';

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import {
  ActionIcon,
  Button,
  NumberInput,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import FormCalendar from './FormCalendar';
import FormGuestRows from './FormGuestRows';
import { guestInitial, useFormCtx } from '../state/formCtx';

const COST_MEMBERS = 15.0;
const COST_GUESTS = 20.0;
export const MAX_ROOMS = 20;

const NewEventForm = () => {
  const { dates, guests, eventText, setGuests, setEventText } = useFormCtx();

  // dates stats display
  const diff = useMemo(() => {
    const d = dayjs(dates[1]).diff(dayjs(dates[0]), 'days') + 1;
    return Number.isFinite(d) ? Math.abs(d) : 0;
  }, [dates]);

  // title guessing
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
        ...Array(nr - guests.length)
          .fill(0)
          .map(guestInitial),
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
  const [isDefaultTitle, setIsDefaultTitle] = useState(true);
  useEffect(() => {
    if (!isDefaultTitle) return;
    setEventText((o) => ({ ...o, title: eventNameGuess }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNameGuess, isDefaultTitle]);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDefaultTitle) setIsDefaultTitle(false);
    setEventText((o) => ({ ...o, title: e.target.value }));
  };

  return (
    <>
      <div className="m-6 mx-auto max-w-3xl p-4 md:p-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* DATE ENTRY */}
          <FormCalendar />
          <div className="flex flex-row justify-end pb-4">
            <p className="text-sm text-slate-600">
              {diff} day{diff !== 1 && 's'} - ${diff * COST_MEMBERS}/member - $
              {diff * COST_GUESTS}/guest
            </p>
          </div>

          <hr className="t" />

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
          </div>

          {/* ROOM SELECTION */}
          <FormGuestRows />

          <hr className="t" />

          {/* EVENT DETAILS */}
          <div className="flex flex-row gap-2">
            <TextInput
              label="Calendar Event Name"
              description="This is how your stay will appear to people checking the calendar."
              value={eventText.title}
              onChange={handleTitleChange}
              className="flex-1"
            />
            <div className="my-1.5 flex flex-col justify-end">
              <Tooltip label="Return to auto-generated title">
                <ActionIcon
                  disabled={isDefaultTitle}
                  onClick={() => setIsDefaultTitle(true)}
                  className=""
                  variant="light"
                >
                  <IconRestore />
                </ActionIcon>
              </Tooltip>
            </div>
          </div>
          <Textarea
            label="Calendar Event Description"
            description="Your room selections will be automatically added to the end of this description."
            value={eventText.description}
            onChange={({ currentTarget: { value: v } }) =>
              setEventText((o) => ({ ...o, description: v }))
            }
            classNames={{
              input: 'h-48',
            }}
          />

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
