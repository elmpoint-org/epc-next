import { useMemo } from 'react';

import { Popover, PopoverButton } from '@headlessui/react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { dateDiff } from '../_util/dateUtils';
import { clamp } from '@/util/math';

import { CalendarProps, EventType } from './ViewEvents';
import EventPopup from './EventPopup';

export default function TimelineEvent({
  event,
  ...props
}: { event: EventType } & CalendarProps) {
  const { dates: dateLimits, days } = props;

  // calculate grid coordinates
  const loc = useMemo(() => {
    const fromStart = dateDiff(event.dateStart, dateLimits.start);
    const fromEnd = dateDiff(event.dateEnd, dateLimits.end);

    const start = clamp((fromStart + 1) * 2, 1, days * 2);
    const end = clamp((fromEnd - 1) * 2, -days * 2, -1);

    const length = days * 2 + end + 2 - start;

    return {
      start,
      end,
      length,
    };
  }, [dateLimits, event, days]);

  return (
    <>
      <Popover
        className="flex flex-row truncate"
        style={{
          gridColumn: `${loc.start} / ${loc.end}`,
        }}
      >
        <PopoverButton className="group flex-1 truncate bg-dwhite focus:outline-none">
          <div className="flex flex-1 flex-row items-center justify-between truncate rounded-lg border border-emerald-600 bg-emerald-600/30 text-emerald-950 group-focus:border-emerald-700">
            {loc.start !== 1 ? (
              <div />
            ) : (
              <IconChevronLeft stroke={1} className="size-4" />
            )}
            {/* event title */}
            <div className="truncate p-2 text-sm">{event.title}</div>
            {loc.end !== -1 ? (
              <div />
            ) : (
              <IconChevronRight stroke={1} className="size-4" />
            )}
          </div>
        </PopoverButton>
        <EventPopup event={event} />
      </Popover>
    </>
  );
}
