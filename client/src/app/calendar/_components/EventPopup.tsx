import { CloseButton, PopoverPanel, type Popover } from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import {
  IconAlignJustified,
  IconBed,
  IconClock,
  IconUser,
  IconX,
} from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { dateFormat } from '../_util/dateUtils';
import { EventType } from './ViewEvents';
import { IconType } from '@/util/iconType';
import { Children } from '@/util/propTypes';

/**
 * place EventPopup inside a headlessui {@link Popover} element for functionality.
 */
export default function EventPopup({ event }: { event: EventType }) {
  return (
    <>
      <PopoverPanel
        transition
        anchor={{
          to: 'bottom',
          gap: '0.5rem',
          padding: '0.5rem',
        }}
        className={clx(
          'z-[199] w-96 rounded-xl border border-slate-300 bg-dwhite shadow-2xl',
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
            'flex flex-col gap-2 p-6',
            /* em */ '[&_em]:not-italic',
          )}
        >
          <h3 className="mb-4 text-xl">{event.title}</h3>
          <div className="grid grid-cols-[min-content_1fr] gap-5">
            {/* dates */}
            <IconRow icon={IconClock}>
              <div className="flex flex-row gap-2">
                <em>{dateFormat(event.dateStart, 'ddd. MMMM D')}</em>
                <span className="text-slate-400">–</span>
                <em>{dateFormat(event.dateEnd, 'ddd. MMMM D')}</em>
              </div>
            </IconRow>

            {/* description */}
            <IconRow
              icon={IconAlignJustified}
              show={!!event.description.length}
            >
              <div>{event.description}</div>
            </IconRow>

            {/* room reservations */}
            <IconRow icon={IconBed} show={!!event.reservations.length}>
              <div className="flex flex-col gap-2">
                {event.reservations
                  .filter((r) => r.room)
                  .map((r, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[min-content_1fr] gap-2 rounded-lg border border-slate-300 p-4"
                    >
                      {/* person's name */}
                      <IconUser stroke={1.5} className="size-4 self-center" />
                      <span>{r.name}</span>

                      {/* room name */}
                      <div />

                      <div className="text-sm">
                        {'text' in r.room! ? (
                          <div className="italic">{r.room.text}</div>
                        ) : (
                          <div className="flex flex-row gap-1">
                            <span className="font-bold text-slate-600">
                              {r.room?.cabin?.name ?? null}
                            </span>
                            <span className="first:hidden">&bull;</span>
                            <span>{r.room?.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </IconRow>
          </div>
        </div>
      </PopoverPanel>
    </>
  );
}

function IconRow(props: { icon: IconType; show?: boolean } & Children) {
  const { icon: Icon, show = true, children } = props;

  if (show)
    return (
      <>
        <Icon className="text-slate-400" />
        {children}
      </>
    );
}
