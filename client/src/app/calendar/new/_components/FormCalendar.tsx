import { useState } from 'react';
import dayjs from 'dayjs';

import { DatePicker } from '@mantine/dates';
import { ActionIcon, Collapse, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronDown,
  IconCircleChevronRight,
} from '@tabler/icons-react';

import { DatesRange, useFormCtx } from '../state/formCtx';

const FormCalendar = () => {
  const { dates, setDates } = useFormCtx();

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
  const prettify = (id: 0 | 1) => () => {
    let temp: DatesRange = dates;
    // reorder dates if necessary
    if ((temp[0]?.valueOf() ?? 0) > (temp[1]?.valueOf() ?? 0)) {
      temp = [temp[1], temp[0]];
      setDates(temp);
      setTdates(temp.map((it) => parseDate(it)));
    } else {
      // otherwise just format the text
      setTdates((o) => ({ ...o, [id]: parseDate(dates[id]) }));
    }
  };

  return (
    <>
      <div className="flex flex-row items-end gap-2">
        <ActionIcon
          onClick={toggleCal}
          aria-label="toggle calendar"
          className="mb-1.5"
          variant="light"
        >
          {isCalOpen ? <IconCircleChevronDown /> : <IconCircleChevronRight />}
        </ActionIcon>

        <TextInput
          label="Start Date"
          description={
            <>The day you arrive, intending to sleep at camp that night.</>
          }
          placeholder="Start Date"
          value={tdates[0]}
          onChange={updateTdate(0)}
          onBlur={prettify(0)}
          className="flex-1"
        />
        <TextInput
          label="End Date"
          description={
            <>
              The day you leave, intending <b>not</b> to sleep at camp that
              night.
            </>
          }
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
            levelsGroup: 'justify-center border-x-8 border-slate-200/80 p-4',
            day: 'border-solid data-[weekend]:[&:not([data-selected])]:text-emerald-800/80 data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border-slate-800/50',
          }}
        />
      </Collapse>
    </>
  );
};
export default FormCalendar;
