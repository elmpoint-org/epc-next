import { useEffect, useState, useTransition } from 'react';

import { MenuButton, Transition, TransitionChild } from '@headlessui/react';
import {
  ActionIcon,
  ActionIconProps,
  Button,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Tooltip,
} from '@mantine/core';
import { DatePicker, MonthPicker } from '@mantine/dates';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalendarMonth,
  IconCheck,
  IconChevronDown,
  IconLayoutList,
  IconLibraryMinus,
  IconLibraryPlus,
  IconListDetails,
  IconLoader2,
  IconPlus,
  IconStackPop,
  IconStackPush,
  IconTable,
} from '@tabler/icons-react';

import { CalendarProps } from './Calendar';
import { dayStyles } from '../_util/dayStyles';
import { dateFormat, dateTSLocal } from '../_util/dateUtils';
import { clamp } from '@/util/math';
import { useDefaultDays } from '../_util/defaultDays';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { useCalendarControls } from '../_util/controls';
import { useCalendarView, useDisplayByRooms } from '../_util/queryStates';
import { IconType } from '@/util/iconType';
import { CALENDAR_DAYS_MAX, CALENDAR_DAYS_MIN } from '@/CONSTANTS';

import EventEditWindow from './EventEditWindow';
import DKbd from '@/app/_components/_base/DKbd';
import {
  Dropdown,
  DropdownItems,
  DropdownOption,
} from '@/app/_components/_base/Dropdown';

export default function Controls(props: CalendarProps) {
  const {
    isLoading,
    selectedDate,
    periodState: { days, setDays, startDate, setStartDate },
    roomCollapse: {
      full: [fullCollapse, setFullCollapse],
      ...roomCollapse
    },
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
    roomLoading(() => {
      setDisplayByRoom(nv);
    });
  }

  const [view, setView] = useCalendarView();

  // new stay prompt
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  const Picker = view === 'OVERVIEW' ? MonthPicker : DatePicker;

  return (
    <>
      <div className="flex flex-row flex-wrap items-center justify-between gap-y-4">
        {/* LEFT GROUP */}
        <div className="flex w-full flex-row items-center justify-between sm:w-auto">
          {/* date picker */}
          <Popover opened={datePickerOpen} onChange={setDatePickerOpen}>
            <PopoverTarget>
              <Tooltip label="Jump to specific date">
                <button
                  className="rounded-md px-1 hover:bg-slate-200"
                  onClick={() => setDatePickerOpen(true)}
                >
                  <h3 className="min-w-20 text-xl">
                    {dateFormat(selectedDate, `MMM 'YY`)}
                  </h3>
                </button>
              </Tooltip>
            </PopoverTarget>
            <PopoverDropdown>
              <Picker
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
            <Tooltip
              label={
                <>
                  Previous period <DKbd>p</DKbd>
                </>
              }
            >
              <ActionIcon
                aria-label="previous period"
                onClick={actions.last}
                color="slate"
                variant="subtle"
              >
                <IconArrowLeft />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                <>
                  Jump to today <DKbd>t</DKbd>
                </>
              }
            >
              <Button
                size="compact-md"
                variant="subtle"
                color="slate"
                onClick={actions.today}
              >
                Today
              </Button>
            </Tooltip>
            <Tooltip
              label={
                <>
                  Next period <DKbd>n</DKbd>
                </>
              }
            >
              <ActionIcon
                aria-label="next period"
                onClick={actions.next}
                color="slate"
                variant="subtle"
              >
                <IconArrowRight />
              </ActionIcon>
            </Tooltip>
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
          {view !== 'OVERVIEW' && (
            <>
              <div className="flex flex-row items-center gap-1">
                <input
                  type="text"
                  className="w-10 rounded-lg border border-transparent bg-transparent p-1 text-right hover:bg-slate-200 focus:border-slate-400 focus:bg-slate-200 focus:outline-none"
                  placeholder={'' + daysWithDefault}
                  value={days ?? ''}
                  onChange={({ currentTarget: { value: v } }) => {
                    if (!v.length) setDays(undefined);
                    const d = parseInt((v.match(/[\d\.]/g) || ['']).join(''));
                    if (Number.isFinite(d))
                      setDays(clamp(d, CALENDAR_DAYS_MIN, CALENDAR_DAYS_MAX));
                  }}
                />
                <span>days</span>
              </div>

              <div className="self-stretch border-l border-slate-300"></div>
            </>
          )}

          {/* rooms controls */}
          <div
            className="flex flex-row items-center gap-2 data-[h]:hidden"
            data-h={view !== 'TIMELINE' || null}
          >
            <Transition show={displayByRoom}>
              {/* collapse button */}
              <TableOption
                label="Collapse all cabins"
                icon={IconLibraryMinus}
                onClick={() => {
                  if (roomCollapse.state === 'CLOSED') setFullCollapse(true);
                  roomCollapse.set('CLOSED');
                }}
              />

              {/* expand button */}
              <TableOption
                label="Expand all cabins"
                icon={IconLibraryPlus}
                onClick={() => roomCollapse.set('OPEN')}
              />

              {/* full collapse */}
              <TableOption
                label={
                  fullCollapse
                    ? 'Show multiple per cabin'
                    : 'Fully collapse cabins'
                }
                icon={fullCollapse ? IconStackPop : IconStackPush}
                onClick={() => setFullCollapse((v) => !v)}
              />
            </Transition>

            <Tooltip
              label={
                <>
                  {displayByRoom ? 'Hide' : 'Show'} rooms table <DKbd>r</DKbd>
                </>
              }
            >
              <ActionIcon
                aria-label="toggle rooms table"
                variant={displayByRoom ? 'filled' : 'subtle'}
                color={displayByRoom ? 'emerald' : 'slate'}
                className="data-[on]:ml-1"
                loading={isRoomLoading}
                data-on={displayByRoom || null}
                onClick={() => updateByRoom(!displayByRoom)}
              >
                <IconTable />
              </ActionIcon>
            </Tooltip>
          </div>

          {/* view type */}
          <Dropdown>
            <Button
              aria-label="change view"
              component={MenuButton}
              color="slate"
              size="compact-sm"
              justify="center"
              variant="subtle"
              rightSection={<IconChevronDown className="size-4" />}
            >
              View
            </Button>

            <DropdownItems className="z-[999]">
              <div className="py-1">
                <DropdownOption
                  icon={IconCalendarMonth}
                  onClick={() => setView('OVERVIEW')}
                >
                  <span className="flex-1 text-left">Month View</span>
                  {view === 'OVERVIEW' && (
                    <IconCheck stroke={1.5} className="text-slate-600" />
                  )}
                </DropdownOption>

                <DropdownOption
                  icon={IconLayoutList}
                  onClick={() => setView('TIMELINE')}
                >
                  <span className="flex-1 text-left">Timeline View</span>
                  {view === 'TIMELINE' && (
                    <IconCheck stroke={1.5} className="text-slate-600" />
                  )}
                </DropdownOption>

                <DropdownOption
                  icon={IconListDetails}
                  onClick={() => setView('AGENDA')}
                >
                  <span className="flex-1 text-left">Arrivals/Departures</span>
                  {view === 'AGENDA' && (
                    <IconCheck stroke={1.5} className="text-slate-600" />
                  )}
                </DropdownOption>
              </div>
            </DropdownItems>
          </Dropdown>

          <div className="self-stretch border-l border-slate-300"></div>

          {/* new stay button */}
          <Tooltip label="Add new stay">
            <ActionIcon
              aria-label="add new stay"
              color="slate"
              variant="light"
              onClick={openNewStay}
              className="xl:hidden"
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>

          <Button
            size="compact-md"
            color="slate"
            variant="light"
            justify="center"
            leftSection={<IconPlus />}
            onClick={openNewStay}
            className="hidden pr-3 text-sm xl:block"
          >
            Add new stay
          </Button>

          {/* popups */}
          <EventEditWindow
            trigger={newStay}
            showDate={new Date(dateTSLocal(selectedDate) * 1000)}
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

function TableOption({
  icon: Icon,
  label,
  ...props
}: { icon: IconType; label: string } & ActionIconProps &
  React.ComponentPropsWithoutRef<'button'>) {
  return (
    <TransitionChild>
      <div className="mr-0 flex flex-col items-center transition-all duration-300 data-[closed]:-mr-9 data-[closed]:opacity-0">
        <Tooltip label={label}>
          <ActionIcon
            aria-label={label}
            variant="subtle"
            color="slate"
            {...props}
          >
            <Icon stroke={1.75} />
          </ActionIcon>
        </Tooltip>
      </div>
    </TransitionChild>
  );
}
