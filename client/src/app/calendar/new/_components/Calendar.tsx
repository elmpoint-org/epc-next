import { useState } from 'react';
import dayjs from 'dayjs';

import { DatePicker } from '@mantine/dates';
import { ActionIcon, Collapse, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import {
  IconCircleChevronDown,
  IconCircleChevronRight,
} from '@tabler/icons-react';

type CalendarProps = {
  dates: [Date | null, Date | null];
  setDates: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
};

const Calendar = ({ dates, setDates }: CalendarProps) => {
  const [isCalOpen, { toggle: toggleCal }] = useDisclosure(true);

  const [tdates, setTdates] = useState(['', '']);

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
      <div className="flex flex-row items-center gap-2">
        <ActionIcon
          onClick={toggleCal}
          aria-label="toggle calendar"
          className="mt-6"
          variant="light"
        >
          {isCalOpen ? <IconCircleChevronDown /> : <IconCircleChevronRight />}
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
            levelsGroup: 'p-4 justify-center border-x-8 border-slate-200/80',
            day: 'data-[weekend]:[&:not([data-selected])]:text-emerald-800/80 data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border-slate-800/50 border-solid',
          }}
        />
      </Collapse>
    </>
  );
};
export default Calendar;
