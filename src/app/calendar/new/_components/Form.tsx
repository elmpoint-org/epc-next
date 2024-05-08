'use client';

import { useState } from 'react';
import dayjs from 'dayjs';

import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { ActionIcon, Button, Collapse, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconCalendarMonth } from '@tabler/icons-react';

const NewEventForm = () => {
  const [isCalOpen, { toggle: toggleCal }] = useDisclosure();

  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [tdates, setTdates] = useState(['', '']);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      startDate: '',
      endDate: '',
    },
  });

  const parseDate = (d: Date | null) =>
    (d && dayjs(d).format('MMM D, YYYY')) ?? '';

  const handleDatePick = (nv: typeof dates) => {
    setDates(nv);
    setTdates(nv.map((it) => parseDate(it)));
  };

  const updateTdate =
    (id: 0 | 1) =>
    ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setTdates((o) => ({ ...o, [id]: value }));
      const nd = dayjs(value);
      if (nd.isValid()) {
        const dd = [...dates];
        dd[id] = nd.toDate();
        setDates(dd as any);
      } else {
        console.log('invalid', value);
      }
    };
  const prettify = (id: 0 | 1) => () =>
    setTdates((o) => ({ ...o, [id]: parseDate(dates[id]) }));

  return (
    <>
      <div className="m-6 mx-auto w-full max-w-3xl">
        <form
          onSubmit={form.onSubmit((v) => console.log(v))}
          className="space-y-2"
        >
          <div className="flex flex-row items-center gap-2">
            <ActionIcon
              onClick={toggleCal}
              aria-label="toggle calendar"
              className="mt-6"
            >
              <IconCalendarMonth />
            </ActionIcon>

            <TextInput
              label="Start Date"
              placeholder="Start Date"
              value={tdates[0]}
              onChange={updateTdate(0)}
              onBlur={prettify(0)}
              className="flex-1"
            />
            <TextInput
              label="End Date"
              placeholder="End Date"
              value={tdates[1]}
              onChange={updateTdate(1)}
              onBlur={prettify(1)}
              className="flex-1"
            />
          </div>
          <Collapse in={isCalOpen}>
            <DatePicker
              type="range"
              value={dates}
              onChange={handleDatePick}
              firstDayOfWeek={0}
              allowSingleDateInRange={true}
              classNames={{
                levelsGroup: 'p-4',
                day: 'data-[weekend]:[&:not([data-selected])]:text-emerald-800/80 data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:bg-sky-600/10',
              }}
            />
          </Collapse>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
};
export default NewEventForm;
