import { useState } from 'react';

import {
  ActionIcon,
  Button,
  Popover,
  PopoverDropdown,
  PopoverTarget,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconArrowLeft, IconArrowRight, IconPlus } from '@tabler/icons-react';

import { CalendarProps } from './ViewEvents';
import { dayStyles } from '../_util/dayStyles';
import { D1, dateFormat, dateTS, dayjs } from '../_util/dateUtils';
import { clamp } from '@/util/math';
import { useDefaultDays } from '../_util/defaultDays';
import { useReverseCbTrigger } from '@/util/reverseCb';

import FloatingWindow from '@/app/_components/_base/FloatingWindow';
import NewEventForm from '../new/_components/NewEventForm';

export default function TimelineControls(props: CalendarProps) {
  const {
    updatePeriod,
    dates,
    periodState: { days, setDays, startDate, setStartDate },
  } = props;

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const defaultDays = useDefaultDays();
  const daysWithDefault = days ?? defaultDays;

  // new stay prompt
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  return (
    <>
      <div className="flex flex-row flex-wrap items-center justify-between gap-y-4">
        <div className="flex w-full flex-row items-center justify-between sm:w-auto">
          {/* date picker */}
          <Popover opened={datePickerOpen} onChange={setDatePickerOpen}>
            <PopoverTarget>
              <button
                className="rounded-md px-1 hover:bg-slate-200"
                onClick={() => setDatePickerOpen(true)}
              >
                <h3 className="min-w-20 text-xl">
                  {dateFormat(dates.start, `MMM 'YY`)}
                </h3>
              </button>
            </PopoverTarget>
            <PopoverDropdown>
              <DatePicker
                value={startDate}
                onChange={(nv) => {
                  if (!nv) return;
                  setStartDate(nv);
                  setDatePickerOpen(false);
                }}
                firstDayOfWeek={0}
                classNames={{
                  levelsGroup: 'popover:border-slate-300 popover:shadow-sm',
                  day: dayStyles,
                }}
              />
            </PopoverDropdown>
          </Popover>

          {/* period controls */}
          <div className="flex flex-row items-center gap-1 px-4">
            <ActionIcon
              aria-label="previous period"
              onClick={() => updatePeriod(dates.start - D1 * daysWithDefault)}
              color="slate"
              variant="subtle"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Button
              size="compact-md"
              variant="subtle"
              color="slate"
              onClick={() => {
                let today = dayjs.unix(dateTS(new Date())).utc();
                if (days === 7) today = today.subtract(today.day(), 'days');
                updatePeriod(today.unix());
              }}
            >
              Today
            </Button>
            <ActionIcon
              aria-label="previous period"
              onClick={() => updatePeriod(dates.start + D1 * daysWithDefault)}
              color="slate"
              variant="subtle"
            >
              <IconArrowRight />
            </ActionIcon>
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-end gap-4 border-t border-slate-300 pt-2 sm:w-auto sm:border-transparent sm:pt-0">
          {/* number of days to show */}
          <div className="flex flex-row items-center gap-1">
            <input
              type="text"
              className="w-10 rounded-lg border border-transparent bg-transparent p-1 text-right hover:bg-slate-200 focus:border-slate-400 focus:bg-slate-200 focus:outline-none"
              value={days}
              onChange={({ currentTarget: { value: v } }) => {
                if (!v.length) setDays(undefined);
                const d = parseInt((v.match(/[\d\.]/g) || ['']).join(''));
                if (Number.isFinite(d)) setDays(clamp(d, 1, 10));
              }}
            />
            <span>days</span>
          </div>

          <div className="self-stretch border-l border-slate-300"></div>

          {/* new stay button */}
          <ActionIcon
            aria-label="add new stay"
            color="slate"
            variant="light"
            onClick={openNewStay}
          >
            <IconPlus />
          </ActionIcon>

          {/* popups */}
          <FloatingWindow
            triggerOpen={newStay}
            title={<>Add Your Stay</>}
            width="48rem"
          >
            <NewEventForm />
          </FloatingWindow>
        </div>
      </div>
    </>
  );
}
