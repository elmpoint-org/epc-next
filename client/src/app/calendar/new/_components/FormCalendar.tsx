import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { CalendarLevel, DatePicker } from '@mantine/dates';
import { ActionIcon, Collapse, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronDown,
  IconCircleChevronRight,
} from '@tabler/icons-react';

import { useFormCtx } from '../state/formCtx';
import { dayStyles } from '../../_util/dayStyles';

const FormCalendar = () => {
  const { dates, setDates, showDate } = useFormCtx();

  // calendar visual state
  const [isCalOpen, cal] = useDisclosure(true);
  const [closeNextTime, setCloseNextTime] = useState(false);
  const [dateShown, setDateShown] = useState(
    showDate ?? dates?.[0] ?? new Date(),
  );

  // calendar text state

  const parseDate = (d: Date | null) =>
    (d && dayjs(d).format('MMM D, YYYY')) ?? '';

  const [tdates, setTdates] = useState(
    dates.length ? [parseDate(dates[0]), parseDate(dates[1])] : ['', ''],
  );

  // functions

  const handleDatePick = (nv: typeof dates) => {
    // check if date picker had been blank before this
    const wasBlank = !tdates[0].length && !tdates[1].length;

    // set values
    setDates(nv);
    setTdates(nv.map((it) => parseDate(it)));

    // close date picker if necessary
    if (nv[0] && nv[1] && closeNextTime) {
      cal.close();
      setCloseNextTime(false);
    }
    if (wasBlank) setCloseNextTime(true);
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
    let temp = dates;
    // reorder dates if necessary
    if (
      (temp[0]?.valueOf() ?? 0) >
      (temp[1]?.valueOf() ?? Number.MAX_SAFE_INTEGER)
    ) {
      temp = [temp[1], temp[0]];
      setDates(temp);
      setTdates(temp.map((it) => parseDate(it)));
    } else {
      // otherwise just format the text
      setTdates((o) => ({ ...o, [id]: parseDate(dates[id]) }));
    }

    // refocus selected dates
    if (temp[0]) setDateShown(temp[0]);
  };

  return (
    <>
      <div className="flex flex-row items-end gap-2">
        <ActionIcon
          onClick={cal.toggle}
          aria-label="toggle calendar"
          className="mb-1"
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
          date={dateShown}
          onDateChange={setDateShown}
          onChange={handleDatePick}
          firstDayOfWeek={0}
          allowSingleDateInRange={true}
          classNames={{
            levelsGroup: 'justify-center border-x-8 border-slate-200/80 p-4',
            day: dayStyles,
          }}
        />
      </Collapse>
    </>
  );
};
export default FormCalendar;
