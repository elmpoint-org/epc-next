import { Popover, PopoverButton } from '@headlessui/react';
import { useEventColorObject } from '../_util/cabinColorHooks';
import {
  useBannerPosition,
  UseBannerPositionProps,
} from '../_util/useBannerPosition';
import { EventType } from './Calendar';
import { clmx } from '@/util/classConcat';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import EventPopup from './EventPopup';

export function EventBanner({
  event,
  ...props
}: { event: EventType } & UseBannerPositionProps) {
  const { loc, arrows } = useBannerPosition(props, event);

  const css = useEventColorObject(event);

  return (
    <Popover
      className="flex flex-row items-center truncate"
      style={{
        gridColumn: `${loc.start} / ${loc.end}`,
      }}
    >
      <PopoverButton className="group flex-1 truncate bg-[--row-color] focus:outline-none">
        <div
          className={clmx(
            'flex flex-1 flex-row items-center justify-between truncate rounded-lg',
            css.main,
          )}
        >
          {arrows.left ? (
            <IconChevronLeft stroke={1} className="size-4 flex-shrink-0" />
          ) : (
            <div />
          )}
          {/* event title */}
          <div className="truncate p-0.5 text-xs md:px-2">{event.title}</div>
          {arrows.right ? (
            <IconChevronRight stroke={1} className="size-4 flex-shrink-0" />
          ) : (
            <div />
          )}
        </div>
      </PopoverButton>
      <EventPopup event={event} />
    </Popover>
  );
}
