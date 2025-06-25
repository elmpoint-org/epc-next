import { useMemo } from 'react';

import type { CalendarProps } from '../_components/Calendar';
import { D1 } from '@epc/date-ts';

export type UseDatesArrayProps = Pick<CalendarProps, 'days'> & {
  dates: Pick<CalendarProps['dates'], 'start'>;
};
/** get an array of all dates between startdate and enddate */
export function useDatesArray(p: UseDatesArrayProps) {
  const { dates: dateLimits, days } = p;

  const dates = useMemo(() => {
    const dates: number[] = [];
    const start = dateLimits.start;
    for (let i = 0; i < days; i++) {
      dates.push(start + i * D1);
    }
    return dates;
  }, [dateLimits, days]);

  return dates;
}
