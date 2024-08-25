import { Fragment, useMemo } from 'react';

import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { clamp } from '@/util/math';
import { D1, dateDiff, dayjs, showDate } from '../_util/dateUtils';

import { CalendarProps } from './ViewEvents';

export default function ViewTimeline(props: CalendarProps) {
  const { events: events_in, days, dates: dateLimits } = props;

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

  return (
    <>
      <div className="flex flex-col">
        <div
          className="grid grid-flow-row-dense auto-rows-fr gap-2"
          style={{
            gridTemplateColumns: `repeat(${days * 2}, minmax(0, 1fr))`,
            gridTemplateRows: '2.5rem',
          }}
        >
          {/* headers */}
          {dates.map((date) => (
            <Fragment key={date}>
              <div className="col-span-2 flex items-center justify-center rounded-md bg-slate-200 text-sm">
                {dayjs.unix(date).utc().format('ddd D')}
              </div>
            </Fragment>
          ))}

          {/* events */}
          {events?.map((evt) => (
            <Popover
              key={evt.id}
              className="flex flex-row truncate"
              style={{
                gridColumn: `${evt.loc.start} / ${evt.loc.end}`,
              }}
            >
              <PopoverButton className="flex h-12 flex-1 flex-row items-center justify-center truncate rounded-lg border border-emerald-600 bg-emerald-600/30 p-2">
                <div className="truncate text-sm">{evt.title}</div>
              </PopoverButton>
              <PopoverPanel
                transition
                anchor="bottom"
                className={clx(
                  'rounded-xl border border-slate-300 bg-dwhite shadow-sm [--anchor-gap:0.5rem]',
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
                      variant="transparent"
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
                                <div className="t">{res.room.name}</div>
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
