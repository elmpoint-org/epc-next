import { lazy, useMemo } from 'react';

import { Popover, PopoverButton } from '@headlessui/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { dateDiff } from '../_util/dateUtils';
import { clamp } from '@/util/math';

import { CalendarProps, EventType } from './Calendar';
import { clmx } from '@/util/classConcat';
import {
  CABIN_COLORS,
  CabinColor,
  getCabinColorObject,
  useEventColorId,
} from '../_util/cabinColors';

const EventPopup = lazy(() => import('./EventPopup'));

export default function TimelineEvent({
  event,
  theme,
  highlightRoom,
  placeholder,
  onOpen,
  ...props
}: {
  event: EventType;
  theme?: CabinColor;
  highlightRoom?: string;
  placeholder?: EventPlaceholder;
  onOpen?: () => void;
} & Pick<CalendarProps, 'dates' | 'days'>) {
  const { dates: dateLimits, days } = props;

  // get correct color scheme
  const parse = (s?: CabinColor) =>
    CABIN_COLORS[s ?? 'DEFAULT'] ?? CABIN_COLORS.DEFAULT;
  const colorId = useEventColorId(event);
  const css = theme ? parse(theme) : getCabinColorObject(colorId, true);

  // calculate grid coordinates
  const loc = useMemo(() => {
    const fromStart = dateDiff(
      placeholder?.start ?? event.dateStart,
      dateLimits.start,
    );
    const fromEnd = dateDiff(placeholder?.end ?? event.dateEnd, dateLimits.end);

    let start = clamp((fromStart + 1) * 2, 1, days * 2);
    let end = clamp((fromEnd - 1) * 2, -days * 2, -1);
    const length = days * 2 + end + 2 - start;

    // correct for single days
    if (length === 0) {
      start--;
      end++;
    }

    return {
      start,
      end,
      length,
    };
  }, [placeholder, event, dateLimits, days]);

  // override button text
  const resText = useMemo(() => {
    if (placeholder?.combined)
      return (
        <span className={clmx('font-bold', css.specialty)}>
          {placeholder.combined}+ people
        </span>
      );

    if (!highlightRoom) return null;
    if (event.reservations.length <= 1) return null;

    const matches = event.reservations.filter(
      (r) => r.room && 'id' in r.room && r.room.id === highlightRoom,
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
    highlightRoom,
    placeholder?.combined,
  ]);

  // show arrows
  const arrLeft =
    loc.start === 1 ||
    (placeholder?.eventId ? event.dateStart < placeholder.start : false);
  const arrRight =
    loc.end === -1 ||
    (placeholder?.eventId ? event.dateEnd > placeholder.end : false);

  return (
    <>
      <Popover
        className="flex flex-row items-center truncate"
        style={{
          gridColumn: `${loc.start} / ${loc.end}`,
        }}
      >
        <PopoverButton className="group flex-1 truncate bg-[--row-color] focus:outline-none">
          <div
            className={clmx(
              'flex flex-1 flex-row items-center justify-between truncate rounded-lg border ring-inset group-focus:ring-1',
              css.main,
            )}
            onClick={(e) => {
              if (placeholder?.combined) {
                e.preventDefault();
                onOpen?.();
              }
            }}
          >
            {arrLeft ? (
              <IconChevronLeft stroke={1} className="size-4 flex-shrink-0" />
            ) : (
              <div />
            )}
            {/* event title */}
            <div className="truncate p-1 text-sm md:px-2">
              {resText ?? event.title}
            </div>
            {arrRight ? (
              <IconChevronRight stroke={1} className="size-4 flex-shrink-0" />
            ) : (
              <div />
            )}
          </div>
        </PopoverButton>
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
