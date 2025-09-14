'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDots,
} from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { Inside } from '@/util/inferTypes';

const days: {
  date: string;
  events: {
    id: number;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
}[] = [
  { date: '2021-12-27', events: [] },
  { date: '2021-12-28', events: [] },
  { date: '2021-12-29', events: [] },
  { date: '2021-12-30', events: [] },
  { date: '2021-12-31', events: [] },
  { date: '2022-01-01', isCurrentMonth: true, events: [] },
  { date: '2022-01-02', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-03',
    isCurrentMonth: true,
    events: [
      {
        id: 1,
        name: 'Design review',
        time: '10AM',
        datetime: '2022-01-03T10:00',
        href: '#',
      },
      {
        id: 2,
        name: 'Sales meeting',
        time: '2PM',
        datetime: '2022-01-03T14:00',
        href: '#',
      },
    ],
  },
  { date: '2022-01-04', isCurrentMonth: true, events: [] },
  { date: '2022-01-05', isCurrentMonth: true, events: [] },
  { date: '2022-01-06', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-07',
    isCurrentMonth: true,
    events: [
      {
        id: 3,
        name: 'Date night',
        time: '6PM',
        datetime: '2022-01-08T18:00',
        href: '#',
      },
    ],
  },
  { date: '2022-01-08', isCurrentMonth: true, events: [] },
  { date: '2022-01-09', isCurrentMonth: true, events: [] },
  { date: '2022-01-10', isCurrentMonth: true, events: [] },
  { date: '2022-01-11', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-12',
    isCurrentMonth: true,
    isToday: true,
    events: [
      {
        id: 6,
        name: "Sam's birthday party",
        time: '2PM',
        datetime: '2022-01-25T14:00',
        href: '#',
      },
    ],
  },
  { date: '2022-01-13', isCurrentMonth: true, events: [] },
  { date: '2022-01-14', isCurrentMonth: true, events: [] },
  { date: '2022-01-15', isCurrentMonth: true, events: [] },
  { date: '2022-01-16', isCurrentMonth: true, events: [] },
  { date: '2022-01-17', isCurrentMonth: true, events: [] },
  { date: '2022-01-18', isCurrentMonth: true, events: [] },
  { date: '2022-01-19', isCurrentMonth: true, events: [] },
  { date: '2022-01-20', isCurrentMonth: true, events: [] },
  { date: '2022-01-21', isCurrentMonth: true, events: [] },
  {
    date: '2022-01-22',
    isCurrentMonth: true,
    isSelected: true,
    events: [
      {
        id: 4,
        name: 'Maple syrup museum',
        time: '3PM',
        datetime: '2022-01-22T15:00',
        href: '#',
      },
      {
        id: 5,
        name: 'Hockey game',
        time: '7PM',
        datetime: '2022-01-22T19:00',
        href: '#',
      },
      {
        id: 6,
        name: 'Hockey game',
        time: '7PM',
        datetime: '2022-01-22T19:00',
        href: '#',
      },
    ],
  },
  { date: '2022-01-23', isCurrentMonth: true, events: [] },
  { date: '2022-01-24', isCurrentMonth: true, events: [] },
  { date: '2022-01-25', isCurrentMonth: true, events: [] },
  { date: '2022-01-26', isCurrentMonth: true, events: [] },
  { date: '2022-01-27', isCurrentMonth: true, events: [] },
  { date: '2022-01-28', isCurrentMonth: true, events: [] },
  { date: '2022-01-29', isCurrentMonth: true, events: [] },
  { date: '2022-01-30', isCurrentMonth: true, events: [] },
  { date: '2022-01-31', isCurrentMonth: true, events: [] },
  { date: '2022-02-01', events: [] },
  { date: '2022-02-02', events: [] },
  { date: '2022-02-03', events: [] },
  {
    date: '2022-02-04',
    events: [
      {
        id: 7,
        name: 'Cinema with friends',
        time: '9PM',
        datetime: '2022-02-04T21:00',
        href: '#',
      },
    ],
  },
  { date: '2022-02-05', events: [] },
  { date: '2022-02-06', events: [] },
];

export function SampleMonth() {
  const [selectedIndex, setSelectedIndex] = useState(
    days.findIndex((it) => it.isSelected),
  );
  const selectedDay = days[selectedIndex];

  const isSelected = useCallback(
    (d: Inside<typeof days>) => {
      return selectedDay && d.date === selectedDay.date;
    },
    [selectedDay],
  );

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      {/* controls */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base leading-6 font-semibold text-slate-900">
          <time dateTime="2022-01">January 2022</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-slate-300 pr-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pr-0 md:hover:bg-slate-50"
            >
              <span className="sr-only">Previous month</span>
              <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-slate-300 px-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-slate-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-slate-300 pl-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pl-0 md:hover:bg-slate-50"
            >
              <span className="sr-only">Next month</span>
              <IconChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
              >
                Month view
                <IconChevronDown
                  className="-mr-1 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                className="ring-opacity-5 absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-slate-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 focus-visible:outline-solid"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-slate-400 hover:text-slate-500">
              <span className="sr-only">Open menu</span>
              <IconDots className="h-5 w-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="ring-opacity-5 absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-slate-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>

      {/* calendar */}
      <div className="ring-opacity-5 shadow ring-1 ring-black lg:flex lg:flex-auto lg:flex-col">
        {/* days header */}
        <div className="grid grid-cols-7 gap-px border-b border-slate-300 bg-slate-200 text-center text-xs leading-6 font-semibold text-slate-700 lg:flex-none">
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className="flex bg-slate-200 text-xs leading-6 text-slate-700 lg:flex-auto">
          {/* full size calendar days */}
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={clx(
                  day.isCurrentMonth
                    ? 'bg-white'
                    : 'bg-slate-50 text-slate-500',
                  'relative px-3 py-2',
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white'
                      : undefined
                  }
                >
                  {day.date.split('-').pop()?.replace(/^0/, '')}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-medium text-slate-900 group-hover:text-emerald-600">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-slate-500 group-hover:text-emerald-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-slate-500">
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>

          {/* mobile calendar days */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day, dayIndex) => (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedIndex(dayIndex)}
                className={clx(
                  day.isCurrentMonth ? 'bg-white' : 'bg-slate-50',
                  (isSelected(day) || day.isToday) && 'font-semibold',
                  isSelected(day) && 'text-white',
                  !isSelected(day) && day.isToday && 'text-emerald-600',
                  !isSelected(day) &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-slate-900',
                  !isSelected(day) &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-slate-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-slate-100 focus:z-10',
                )}
              >
                <time
                  dateTime={day.date}
                  className={clx(
                    isSelected(day) &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    isSelected(day) && day.isToday && 'bg-emerald-600',
                    isSelected(day) && !day.isToday && 'bg-slate-900',
                    'ml-auto',
                  )}
                >
                  {day.date.split('-').pop()?.replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span
                        key={event.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-slate-400"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* selected day's events */}
      {selectedDay?.events.length ? (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="ring-opacity-5 divide-y divide-slate-100 overflow-hidden rounded-lg bg-white text-sm shadow-sm ring-1 ring-black">
            {selectedDay.events.map((event) => (
              <li
                key={event.id}
                className="group flex p-4 pr-6 focus-within:bg-slate-50 hover:bg-slate-50"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-slate-900">{event.name}</p>
                  <time
                    dateTime={event.datetime}
                    className="mt-2 flex items-center text-slate-700"
                  >
                    <IconClock
                      className="mr-2 h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                    {event.time}
                  </time>
                </div>
                <a
                  href={event.href}
                  className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-slate-900 opacity-0 shadow-xs ring-1 ring-slate-300 ring-inset group-hover:opacity-100 hover:ring-slate-400 focus:opacity-100"
                >
                  Edit<span className="sr-only">, {event.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="mx-4 px-4 py-10 text-sm italic sm:px-6 lg:hidden">
          no events.
        </div>
      )}
    </div>
  );
}

export function SampleWeek() {
  const container = useRef<HTMLDivElement | null>(null);
  const containerNav = useRef<HTMLDivElement | null>(null);
  const containerOffset = useRef<HTMLDivElement | null>(null);

  // Set the container scroll position based on the current time.
  useEffect(() => {
    if (!(container.current && containerNav.current && containerOffset.current))
      return;

    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  // generate variable classes
  // sm:col-start-1 sm:col-start-2 sm:col-start-3 sm:col-start-4 sm:col-start-5 sm:col-start-6 sm:col-start-7

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-slate-200 px-6 py-4">
        <h1 className="text-base leading-6 font-semibold text-slate-900">
          <time dateTime="2022-01">January 2022</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-xs md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-slate-300 pr-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pr-0 md:hover:bg-slate-50"
            >
              <span className="sr-only">Previous week</span>
              <IconChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-slate-300 px-3.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-slate-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-slate-300 pl-1 text-slate-400 hover:text-slate-500 focus:relative md:w-9 md:pl-0 md:hover:bg-slate-50"
            >
              <span className="sr-only">Next week</span>
              <IconChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <MenuButton
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-xs ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
              >
                Week view
                <IconChevronDown
                  className="-mr-1 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems
                transition
                className="ring-opacity-5 absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <div className="py-1">
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Day view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Week view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Month view
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                    >
                      Year view
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
            <div className="ml-6 h-6 w-px bg-slate-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 focus-visible:outline-solid"
            >
              Add event
            </button>
          </div>
          <Menu as="div" className="relative ml-6 md:hidden">
            <MenuButton className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-slate-400 hover:text-slate-500">
              <span className="sr-only">Open menu</span>
              <IconDots className="h-5 w-5" aria-hidden="true" />
            </MenuButton>

            <MenuItems
              transition
              className="ring-opacity-5 absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-slate-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Create event
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Go to today
                  </a>
                </MenuItem>
              </div>
              <div className="py-1">
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Day view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Week view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Month view
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-slate-700 data-focus:bg-slate-100 data-focus:text-slate-900"
                  >
                    Year view
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <div
        ref={container}
        className="isolate flex max-h-dvh flex-auto flex-col overflow-auto bg-white"
      >
        <div
          style={{ width: '165%' }}
          className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full"
        >
          <div
            ref={containerNav}
            className="ring-opacity-5 sticky top-0 z-30 flex-none bg-white shadow-sm ring-1 ring-black sm:pr-8"
          >
            {/* small screen headers */}
            <div className="grid grid-cols-7 text-sm leading-6 text-slate-500 sm:hidden">
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                M{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  10
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                T{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  11
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                W{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                  12
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                T{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  13
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                F{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  14
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                S{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  15
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center pt-2 pb-3"
              >
                S{' '}
                <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-slate-900">
                  16
                </span>
              </button>
            </div>

            {/* large screen headers */}
            <div className="-mr-px hidden grid-cols-7 divide-x divide-slate-100 border-r border-slate-100 text-sm leading-6 text-slate-500 sm:grid">
              <div className="col-end-1 w-14" />
              <div className="flex items-center justify-center py-3">
                <span>
                  Mon{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    10
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Tue{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    11
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span className="flex items-baseline">
                  Wed{' '}
                  <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                    12
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Thu{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    13
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Fri{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    14
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Sat{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    15
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-center py-3">
                <span>
                  Sun{' '}
                  <span className="items-center justify-center font-semibold text-slate-900">
                    16
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-slate-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 row-start-1 grid divide-y divide-slate-100"
                style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-slate-400">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-slate-100 sm:grid sm:grid-cols-7">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-2 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-4 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-6 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-8 row-span-full w-8" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
                style={{
                  gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
                }}
              >
                <li
                  className={clx('relative mt-px flex', `sm:col-start-${5}`)}
                  style={{ gridRow: '74 / span 12' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
                  >
                    <p className="order-1 font-semibold text-blue-700">
                      Breakfast
                    </p>
                    <p className="text-blue-500 group-hover:text-blue-700">
                      <time dateTime="2022-01-12T06:00">6:00 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px flex sm:col-start-3"
                  style={{ gridRow: '92 / span 30' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
                  >
                    <p className="order-1 font-semibold text-pink-700">
                      Flight to Paris
                    </p>
                    <p className="text-pink-500 group-hover:text-pink-700">
                      <time dateTime="2022-01-12T07:30">7:30 AM</time>
                    </p>
                  </a>
                </li>
                <li
                  className="relative mt-px hidden sm:col-start-6 sm:flex"
                  style={{ gridRow: '122 / span 24' }}
                >
                  <a
                    href="#"
                    className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-slate-100 p-2 text-xs leading-5 hover:bg-slate-200"
                  >
                    <p className="order-1 font-semibold text-slate-700">
                      Meeting with design team at Disney
                    </p>
                    <p className="text-slate-500 group-hover:text-slate-700">
                      <time dateTime="2022-01-15T10:00">10:00 AM</time>
                    </p>
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
