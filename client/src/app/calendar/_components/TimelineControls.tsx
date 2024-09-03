import { useEffect, useState, useTransition } from 'react';

import {
  ActionIcon,
  Button,
  Popover,
  PopoverDropdown,
  PopoverTarget,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowRight,
  IconLayoutNavbarCollapseFilled,
  IconLayoutNavbarExpandFilled,
  IconLoader2,
  IconPlus,
  IconTable,
  IconTableFilled,
} from '@tabler/icons-react';

import { CalendarProps } from './ViewEvents';
import { dayStyles } from '../_util/dayStyles';
import { dateFormat, dateTSLocal } from '../_util/dateUtils';
import { clamp } from '@/util/math';
import { useDefaultDays } from '../_util/defaultDays';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { useCalendarControls } from '../_util/controls';

import { Transition } from '@headlessui/react';
import EventEditWindow from './EventEditWindow';
import { useDisplayByRooms } from '../_util/displayByRooms';

export default function TimelineControls(props: CalendarProps) {
  const {
    isLoading,
    dates,
    periodState: { days, setDays, startDate, setStartDate },
    roomCollapse,
  } = props;

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const defaultDays = useDefaultDays();
  const daysWithDefault = days ?? defaultDays;

  const [dateShown, setDateShown] = useState(new Date());
  useEffect(() => {
    setDateShown(startDate);
  }, [startDate]);

  const actions = useCalendarControls(props);

  const [isRoomLoading, roomLoading] = useTransition();
  const [displayByRoom, setDisplayByRoom] = useDisplayByRooms();
  function updateByRoom(nv: boolean) {
    roomLoading(async () => setDisplayByRoom(nv));
  }

  // new stay prompt
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  return (
    <>
      <div className="flex flex-row flex-wrap items-center justify-between gap-y-4">
        {/* LEFT GROUP */}
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
                date={dateShown}
                onDateChange={setDateShown}
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
              onClick={actions.last}
              color="slate"
              variant="subtle"
            >
              <IconArrowLeft />
            </ActionIcon>
            <Button
              size="compact-md"
              variant="subtle"
              color="slate"
              onClick={actions.today}
            >
              Today
            </Button>
            <ActionIcon
              aria-label="next period"
              onClick={actions.next}
              color="slate"
              variant="subtle"
            >
              <IconArrowRight />
            </ActionIcon>
          </div>

          {/* desktop loader */}
          <div className="hidden sm:block">
            <Loader show={isLoading} />
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="flex w-full flex-row items-center justify-end gap-4 border-t border-slate-300 pt-3 sm:w-auto sm:border-transparent sm:pt-0">
          {/* mobile loader */}
          <div className="flex flex-1 flex-row px-2 sm:hidden">
            <Loader show={isLoading} />
          </div>

          {/* number of days to show */}
          <div className="flex flex-row items-center gap-1">
            <input
              type="text"
              className="w-10 rounded-lg border border-transparent bg-transparent p-1 text-right hover:bg-slate-200 focus:border-slate-400 focus:bg-slate-200 focus:outline-none"
              placeholder={'' + daysWithDefault}
              value={days ?? ''}
              onChange={({ currentTarget: { value: v } }) => {
                if (!v.length) setDays(undefined);
                const d = parseInt((v.match(/[\d\.]/g) || ['']).join(''));
                if (Number.isFinite(d)) setDays(clamp(d, 1, 10));
              }}
            />
            <span>days</span>
          </div>

          <div className="self-stretch border-l border-slate-300"></div>

          {/* rooms controls */}
          <div className="flex flex-row items-center gap-2">
            <ActionIcon
              variant={displayByRoom ? 'light' : 'subtle'}
              color={displayByRoom ? 'emerald' : 'slate'}
              loading={isRoomLoading}
              onClick={() => updateByRoom(!displayByRoom)}
            >
              {displayByRoom ? <IconTableFilled /> : <IconTable />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="slate"
              onClick={() => roomCollapse.set('CLOSED')}
            >
              <IconLayoutNavbarCollapseFilled />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="slate"
              onClick={() => roomCollapse.set('OPEN')}
            >
              <IconLayoutNavbarExpandFilled />
            </ActionIcon>
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
          <EventEditWindow
            trigger={newStay}
            showDate={new Date(dateTSLocal(dates.start) * 1000)}
          />
        </div>
      </div>
    </>
  );
}

function Loader({ show }: { show: boolean }) {
  return (
    <Transition show={show}>
      <div className="flex translate-x-0 items-center justify-center transition duration-150 data-[closed]:opacity-0">
        <IconLoader2 className="animate-spin text-slate-500" />
      </div>
    </Transition>
  );
}
