import { useMemo } from 'react';

import { dateDiff } from '@epc/date-ts';
import { clamp } from '@/util/math';

import { CalendarProps, EventType } from '../_components/Calendar';
import { EventPlaceholder } from '../_components/TimelineEvent';

export type UseBannerPositionProps = Pick<CalendarProps, 'dates' | 'days'>;
export function useBannerPosition(
  props: UseBannerPositionProps,
  event: EventType,
  placeholder?: EventPlaceholder,
) {
  const { dates: dateLimits, days } = props;

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

  // show arrows
  const arrLeft =
    (loc.start === 1 && loc.length !== 0) ||
    (placeholder?.eventId ? event.dateStart < placeholder.start : false);
  const arrRight =
    (loc.end === -1 && loc.length !== 0) ||
    (placeholder?.eventId ? event.dateEnd > placeholder.end : false);

  return {
    loc,
    arrows: { left: arrLeft, right: arrRight },
  };
}
