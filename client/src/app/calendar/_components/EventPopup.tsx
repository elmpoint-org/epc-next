import { useTransition } from 'react';

import { CloseButton, PopoverPanel, type Popover } from '@headlessui/react';
import { ActionIcon, ScrollArea } from '@mantine/core';
import {
  IconAlignJustified,
  IconBed,
  IconClock,
  IconPencil,
  IconUser,
  IconX,
} from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { dateFormat } from '../_util/dateUtils';
import { EventType } from './ViewEvents';
import { IconType } from '@/util/iconType';
import { Children } from '@/util/propTypes';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { TransitionProvider } from '@/app/_ctx/transition';

import EventEditWindow from './EventEditWindow';

/**
 * place EventPopup inside a headlessui {@link Popover} element for functionality.
 */
export default function EventPopup({ event }: { event: EventType }) {
  // stay editor setup
  const { prop: triggerEditStay, trigger: runEditStay } = useReverseCbTrigger();
  const transition = useTransition();
  const [isLoading] = transition;

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
          'z-[199] flex w-96 flex-col !overflow-hidden rounded-xl border border-slate-300 bg-dwhite shadow-2xl',
          /* transition */ 'translate-y-0 transition data-[closed]:-translate-y-2 data-[closed]:opacity-0',
        )}
      >
        {/* popup header bar */}
        <div className="flex flex-row items-center justify-between border-b border-slate-300 bg-dwhite p-2">
          <div className="select-none px-2 text-sm">Event details</div>
          <div className="flex flex-row items-center gap-2">
            {/* edit button */}
            <button
              aria-label="edit"
              className="flex items-center"
              onClick={() => runEditStay()}
              disabled={isLoading}
            >
              <ActionIcon
                component="div"
                loading={isLoading}
                className="-mt-0.5"
                color="slate"
                variant="subtle"
                size="sm"
              >
                <IconPencil />
              </ActionIcon>
            </button>

            {/* close button */}
            <CloseButton
              className="flex items-center"
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
        </div>

        {/* event details */}
        <ScrollArea
          classNames={{
            root: 'flex flex-col',
            scrollbar: 'm-1',
          }}
        >
          <div className="flex flex-col gap-2 p-6">
            {/* title */}
            <div className="flex flex-row">
              <h3 className="mb-4 flex-1 text-xl">{event.title}</h3>
              <div
                className="size-6 rounded-full bg-slate-300 bg-contain data-[h]:hidden"
                data-h={!event.author || null}
                title={`created by ${event.author?.name}`}
                style={{
                  backgroundImage: `url(${event.author?.avatarUrl})`,
                }}
              />
            </div>

            <div className="grid grid-cols-[min-content_1fr] gap-5">
              {/* dates */}
              <IconRow icon={IconClock}>
                <div className="flex flex-row gap-2">
                  <span>{dateFormat(event.dateStart, 'dddd, MMM D')}</span>
                  <span className="text-slate-400">–</span>
                  <span>{dateFormat(event.dateEnd, 'dddd, MMM D')}</span>
                </div>
              </IconRow>

              {/* description */}
              <IconRow
                icon={IconAlignJustified}
                show={!!event.description.length}
              >
                <div>
                  {event.description.split('\n').map((line) => (
                    <>
                      {line}
                      <br className="last:hidden" />
                    </>
                  ))}
                </div>
              </IconRow>

              {/* room reservations */}
              <IconRow icon={IconBed} show={!!event.reservations.length}>
                <div className="flex flex-col gap-2">
                  {event.reservations
                    .filter((r) => r.room)
                    .map((r, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[min-content_1fr] gap-x-3 gap-y-2 rounded-lg border border-slate-300 p-4"
                      >
                        {/* person's name */}
                        <IconUser stroke={1.5} className="size-4 self-center" />
                        <span>
                          {r.name}
                          {!r.name.length && (
                            <span className="italic">no name</span>
                          )}
                        </span>

                        {/* room name */}
                        <div />

                        <div className="text-sm">
                          {'text' in r.room! ? (
                            <div className="italic">{r.room.text}</div>
                          ) : (
                            <div className="flex flex-row gap-1">
                              {r.room?.cabin && (
                                <span className="font-bold text-slate-600">
                                  {r.room.cabin.name}
                                </span>
                              )}
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
        </ScrollArea>
      </PopoverPanel>

      {/* edit form modal */}
      <TransitionProvider transition={transition}>
        <EventEditWindow trigger={triggerEditStay} event={event} />
      </TransitionProvider>
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
