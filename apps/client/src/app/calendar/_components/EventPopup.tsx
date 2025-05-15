import { Fragment, lazy, useMemo, useTransition } from 'react';
import Image from 'next/image';

import { CloseButton, PopoverPanel, type Popover } from '@headlessui/react';
import {
  ActionIcon,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  ScrollArea,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconBed,
  IconClock,
  IconPencil,
  IconUser,
  IconX,
} from '@tabler/icons-react';

import { clmx, clx } from '@/util/classConcat';
import { dateFormat } from '../_util/dateUtils';
import { EventType } from './Calendar';
import { IconType } from '@/util/iconType';
import { Children } from '@/util/propTypes';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { TransitionProvider } from '@/app/_ctx/transition';
import { getCabinColorObject } from '../_util/cabinColors';

import RoomSwatch from './RoomSwatch';
import { useUser } from '@/app/_ctx/user/context';
import { scopeCheck } from '@/util/scopeCheck';
const EventEditWindow = lazy(() => import('./EventEditWindow'));

/**
 * place EventPopup inside a headlessui {@link Popover} element for functionality.
 */
export default function EventPopup({
  event,
  highlightRoom,
  to: placement,
}: {
  event: EventType;
  highlightRoom?: string;
  to?: Placement;
}) {
  // stay editor setup
  const { prop: triggerEditStay, trigger: runEditStay } = useReverseCbTrigger();
  const transition = useTransition();
  const [isLoading] = transition;

  const user = useUser();

  const canEdit = useMemo(() => {
    // is admin?
    if (scopeCheck(user?.scope ?? [], 'ADMIN', 'CALENDAR_ADMIN')) return true;

    // is author?
    if (!user) return false;
    if (user && user.id === event.author?.id) return true;

    // is trusted user?
    if (user && event.author?.trustedUsers?.some((it) => it?.id === user.id))
      return true;

    // not trusted.
    return false;
  }, [event.author?.id, event.author?.trustedUsers, user]);

  return (
    <>
      <PopoverPanel
        transition
        anchor={{
          to: placement ?? 'bottom',
          gap: '0.5rem',
          padding: '0.5rem',
        }}
        className={clx(
          'z-[199] flex w-[25rem] flex-col !overflow-hidden rounded-xl border border-slate-300 bg-dwhite shadow-2xl',
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
              disabled={!canEdit || isLoading}
            >
              <ActionIcon
                component="div"
                disabled={!canEdit}
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

              {/* author avatar */}
              {event.author?.avatarUrl && (
                <HoverCard position="top">
                  <HoverCardTarget>
                    <Image
                      src={event.author.avatarUrl}
                      alt={`${event.author.name} profile picture`}
                      width={24}
                      height={24}
                      className="h-[24px] rounded-full bg-slate-300"
                      draggable={false}
                    />
                  </HoverCardTarget>
                  <HoverCardDropdown
                    classNames={{
                      dropdown:
                        'select-none border-none bg-slate-900 px-[10px] py-[5px] text-sm text-dwhite',
                    }}
                  >
                    <div>Created by {event.author.name}</div>
                  </HoverCardDropdown>
                </HoverCard>
              )}
            </div>

            <div className="grid grid-cols-[min-content_1fr] gap-5">
              {/* dates */}
              <IconRow icon={IconClock}>
                <div className="flex flex-row gap-2 text-center leading-snug">
                  <span>
                    <span>{dateFormat(event.dateStart, 'dddd')}</span>
                    <span>, </span>
                    <span className="whitespace-nowrap">
                      {dateFormat(event.dateStart, 'MMM D')}
                    </span>
                  </span>
                  <span className="text-slate-400">–</span>
                  <span>
                    <span>{dateFormat(event.dateEnd, 'dddd')}</span>
                    <span>, </span>
                    <span className="whitespace-nowrap">
                      {dateFormat(event.dateEnd, 'MMM D')}
                    </span>
                  </span>
                </div>
              </IconRow>

              {/* description */}
              <IconRow
                icon={IconAlignJustified}
                show={!!event.description.length}
              >
                <div>
                  {event.description.split('\n').map((line, i) => (
                    <Fragment key={i}>
                      {line}
                      <br className="last:hidden" />
                    </Fragment>
                  ))}
                </div>
              </IconRow>

              {/* room reservations */}
              <IconRow icon={IconBed} show={!!event.reservations.length}>
                <div className="flex flex-col gap-2">
                  {event.reservations
                    .filter((r) => r.room)
                    .map((r, i) => {
                      const highlighted =
                        r.room && 'id' in r.room && r.room.id === highlightRoom;
                      const rcId =
                        r.room && 'id' in r.room
                          ? (r.room?.cabin?.id ?? r.room?.id)
                          : undefined;
                      const css = getCabinColorObject(rcId);

                      return (
                        <div
                          key={i}
                          className={clmx(
                            'group grid grid-cols-[min-content_1fr] gap-x-3 gap-y-2 rounded-lg border border-slate-300 p-4',
                            highlighted && css?.selected,
                          )}
                          data-h={highlighted || null}
                        >
                          {/* person's name */}
                          <IconUser
                            stroke={highlighted ? 2 : 1.5}
                            className="size-4 self-center"
                          />
                          <span className="leading-snug">
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
                              <div className="-mx-2 -my-1 max-w-fit rounded-md border border-transparent px-2 py-1 leading-normal">
                                <RoomSwatch
                                  cabinOrRoomId={rcId}
                                  className="mb-px mr-1.5 inline-block"
                                />
                                {r.room?.cabin && (
                                  <>
                                    <span
                                      className={clmx(
                                        'font-bold text-slate-600',
                                        highlighted && css?.specialty,
                                      )}
                                    >
                                      {r.room.cabin.name}
                                    </span>
                                    <span className="mx-1">&bull;</span>
                                  </>
                                )}
                                <span>{r.room?.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

type AnchorProps = Parameters<typeof PopoverPanel>[0]['anchor'] & {};
type StrOnly<T> = T extends string ? T : never;
type Placement = StrOnly<AnchorProps>;
