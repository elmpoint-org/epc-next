import { Fragment, useMemo } from 'react';

import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { clamp } from '@/util/math';
import {
  D1,
  dateDiff,
  dateFormat,
  dateTS,
  showDate,
} from '../_util/dateUtils';

import { CalendarProps } from './ViewEvents';

export default function ViewTimeline(props: CalendarProps) {
  const { events: events_in, days, dates: dateLimits, updatePeriod } = props;

  const dates = useMemo(() => {
    const dates: number[] = [];
    const start = dateLimits.start;
    for (let i = 0; i < days; i++) {
      dates.push(start + i * D1);
    }
    return dates;
  }, [dateLimits, days]);

  const events = useMemo(
    () =>
      events_in?.map((evt) => {
        const fromStart = dateDiff(evt.dateStart, dateLimits.start);
        const fromEnd = dateDiff(evt.dateEnd, dateLimits.end);

        const start = clamp((fromStart + 1) * 2, 1, days * 2);
        const end = clamp((fromEnd - 1) * 2, -days * 2, -1);

        const length = days * 2 + end + 2 - start;

        return {
          ...evt,
          loc: {
            start,
            end,
            length,
          },
        };
      }),
    [dateLimits, events_in, days],
  );

  const gridTemplateColumns = `repeat(${days * 2}, minmax(0, 1fr))`;

  return (
    <>
      <div className="relative flex min-h-96 flex-col">
        {/* divider lines */}
        <div
          className="absolute inset-0 grid divide-x divide-slate-300 "
          style={{ gridTemplateColumns }}
        >
          {dates.map((_, i) => (
            <div key={i} className="col-span-2" />
          ))}
        </div>

        {/* header */}
        <div className="z-50 overflow-hidden">
          <div
            className="-m-2 mb-2 grid grid-flow-row auto-rows-fr divide-x divide-slate-300 border-b border-slate-300 bg-dwhite p-2 shadow-sm"
            style={{ gridTemplateColumns }}
          >
            {dates.map((date, i) => (
              <button
                key={date}
                onClick={() => {
                  console.log('setting to', dateFormat(date, 'MM-DD'));
                  updatePeriod(date);
                }}
                className="group col-span-2 flex flex-row items-center justify-center gap-1 p-2 text-sm"
                style={{
                  gridColumnStart: `${i * 2 + 1}`,
                }}
              >
                <span className="t">{dateFormat(date, 'ddd')}</span>
                <span
                  className="flex size-7 items-center justify-center rounded-full border border-transparent font-bold group-hover:bg-slate-300/50 data-[td]:ml-0.5 data-[td]:bg-emerald-700 data-[td]:text-dwhite group-hover:data-[td]:bg-emerald-800"
                  data-td={date === dateTS(new Date()) || null}
                >
                  {dateFormat(date, 'D')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* events grid */}
        <div
          className="z-40 grid grid-flow-row-dense auto-rows-fr gap-2"
          style={{ gridTemplateColumns }}
        >
          {events?.map((evt) => (
            // single event
            <Popover
              key={evt.id}
              className="flex flex-row truncate"
              style={{
                gridColumn: `${evt.loc.start} / ${evt.loc.end}`,
              }}
            >
              <PopoverButton className="group flex-1 truncate bg-dwhite focus:outline-none">
                <div className="flex flex-1 flex-row items-center justify-between truncate rounded-lg border border-emerald-600 bg-emerald-600/30 text-emerald-950 group-focus:border-emerald-700">
                  {evt.loc.start !== 1 ? (
                    <div />
                  ) : (
                    <IconChevronLeft stroke={1} className="size-4" />
                  )}
                  {/* event title */}
                  <div className="truncate p-2 text-sm">{evt.title}</div>
                  {evt.loc.end !== -1 ? (
                    <div />
                  ) : (
                    <IconChevronRight stroke={1} className="size-4" />
                  )}
                </div>
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className={clx(
                  'z-[199] m-2 !overflow-hidden rounded-xl border border-slate-300 bg-dwhite shadow-2xl',
                  /* transition */ 'translate-y-0 transition data-[closed]:-translate-y-2 data-[closed]:opacity-0',
                )}
              >
                {/* popup header bar */}
                <div className="flex flex-row items-center justify-between border-b border-slate-300 p-2">
                  <div className="select-none px-2 text-sm">Event details</div>
                  <CloseButton
                    className="flex flex-row items-center"
                    aria-label="close dialog"
                  >
                    <ActionIcon
                      component="div"
                      color="slate"
                      variant="subtle"
                      size="sm"
                    >
                      <IconX />
                    </ActionIcon>
                  </CloseButton>
                </div>

                {/* event details */}
                <div
                  className={clx(
                    'p-6',
                    /* em */ '[&_em]:font-bold [&_em]:not-italic [&_em]:text-slate-600',
                  )}
                >
                  <p>
                    title: <em>{evt.title}</em>
                  </p>
                  <p>
                    author: <em>{evt.author?.name}</em>
                  </p>

                  <p>
                    dates: <em>{showDate(evt.dateStart)}</em> to{' '}
                    <em>{showDate(evt.dateEnd)}</em>
                  </p>

                  <div className="t">
                    <h4 className="t">rooms:</h4>
                    <div className="flex flex-col gap-2 p-2">
                      {evt.reservations.map((res, i) => (
                        <div
                          key={i}
                          className="flex flex-row items-center gap-2"
                        >
                          <div className="t">{res.name}</div>
                          <div className="t">-</div>
                          {res.room &&
                            ('text' in res.room ? (
                              <>
                                <div className="italic">{res.room.text}</div>
                              </>
                            ) : (
                              <>
                                <div className="t">
                                  {res.room.cabin && `${res.room.cabin.name}: `}
                                  {res.room.name}
                                </div>
                              </>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Popover>
          ))}
          {/* <div className="col-start-[9] col-end-[13] h-12 rounded-lg bg-red-500/50" />
          <div className="col-start-[2] col-end-[9] h-12 rounded-lg bg-red-500/50" /> */}
        </div>
      </div>
    </>
  );
}
