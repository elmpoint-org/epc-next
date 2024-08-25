import { CloseButton, PopoverPanel, type Popover } from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { showDate } from '../_util/dateUtils';
import { EventType } from './ViewEvents';

/**
 * place EventPopup inside a headlessui {@link Popover} element for functionality.
 */
export default function EventPopup({ event }: { event: EventType }) {
  return (
    <>
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
            title: <em>{event.title}</em>
          </p>
          <p>
            author: <em>{event.author?.name}</em>
          </p>

          <p>
            dates: <em>{showDate(event.dateStart)}</em> to{' '}
            <em>{showDate(event.dateEnd)}</em>
          </p>

          <div className="t">
            <h4 className="t">rooms:</h4>
            <div className="flex flex-col gap-2 p-2">
              {event.reservations.map((res, i) => (
                <div key={i} className="flex flex-row items-center gap-2">
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
    </>
  );
}
