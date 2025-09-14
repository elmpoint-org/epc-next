import { lazy, useMemo } from 'react';

import { Popover, PopoverButton } from '@headlessui/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { EventType } from './Calendar';
import { clmx } from '@/util/classConcat';
import { CabinColor } from '../_util/cabinColors';
import { useEventColorObject } from '../_util/cabinColorHooks';
import {
  useBannerPosition,
  UseBannerPositionProps,
} from '../_util/useBannerPosition';

const EventPopup = lazy(() => import('./EventPopup'));

export default function TimelineEvent({
  event,
  theme,
  highlightRoom,
  highlightCabin,
  edgeOffset,
  isCompact,
  placeholder,
  onOpen,
  ...props
}: {
  event: EventType;
  theme?: CabinColor;
  highlightRoom?: string;
  highlightCabin?: string;
  edgeOffset?: boolean;
  isCompact?: boolean;
  placeholder?: EventPlaceholder;
  onOpen?: () => void;
} & UseBannerPositionProps) {
  const { arrows, loc } = useBannerPosition(props, event, placeholder);

  // get correct color scheme
  const css = useEventColorObject(event, theme);

  // override button text
  const resText = useMemo(() => {
    if (placeholder?.combined)
      return (
        <span className={clmx('font-bold', css.specialty)}>
          {placeholder.combined}+ people
        </span>
      );

    if (!(highlightRoom || highlightCabin)) return null;
    if (event.reservations.length <= 1) return null;

    const matches = event.reservations.filter(
      (r) =>
        r.room &&
        'id' in r.room &&
        (r.room.id === highlightRoom ||
          (highlightCabin && r.room.cabin?.id === highlightCabin)),
    );
    if (!matches.length) return null;
    let inside = '';
    if (matches.length === 1) inside = matches[0].name;
    else inside = `${matches.length}+ people`;

    return (
      <>
        <span>{inside} </span>
        <span className={clmx(css.specialty)}>({event.title})</span>
      </>
    );
  }, [
    css.specialty,
    event.reservations,
    event.title,
    highlightCabin,
    highlightRoom,
    placeholder?.combined,
  ]);

  return (
    <>
      <Popover
        className="flex flex-row items-center truncate"
        style={{
          gridColumn: `${loc.start} / ${loc.end}`,
        }}
      >
        {edgeOffset && !arrows.left && <div className="w-6" />}
        <PopoverButton className="group flex-1 truncate bg-(--row-color) focus:outline-hidden">
          <div
            className={clmx(
              'flex flex-1 flex-row items-center justify-between truncate rounded-lg border ring-inset group-focus:ring-1',
              isCompact && 'rounded-md',
              css.main,
            )}
            onClick={(e) => {
              if (placeholder?.combined) {
                e.preventDefault();
                onOpen?.();
              }
            }}
          >
            {arrows.left ? (
              <IconChevronLeft stroke={1} className="size-4 shrink-0" />
            ) : (
              <div />
            )}
            {/* event title */}
            <div
              className={clmx(
                'truncate p-1 text-sm md:px-2',
                isCompact && 'py-0.5 text-xs md:px-1',
              )}
            >
              {resText ?? event.title}
            </div>
            {arrows.right ? (
              <IconChevronRight stroke={1} className="size-4 shrink-0" />
            ) : (
              <div />
            )}
          </div>
        </PopoverButton>
        {edgeOffset && !arrows.right && <div className="w-6" />}

        {!placeholder?.combined && (
          <EventPopup event={event} highlightRoom={highlightRoom} />
        )}
      </Popover>
    </>
  );
}

export type EventPlaceholder = {
  eventId?: string;
  combined?: number;
  start: number;
  end: number;
};
