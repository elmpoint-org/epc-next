import { useMemo } from 'react';
import { CalendarProps } from '../_components/ViewEvents';

import dayjsRoot from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjsRoot.extend(utc);

export const dayjs = dayjsRoot;

/** one day in seconds */
export const D1 = 24 * 3600;

export function dateTS(d: Date | number, isInputNotUTC: boolean = true) {
  const day = d instanceof Date ? dayjs(d) : dayjs.unix(d);
  return day.utc(isInputNotUTC).startOf('date').unix();
}

export function showDate(d: Date | number) {
  const date = d instanceof Date ? dayjs(d) : dayjs.unix(d);
  return date.utc().format('YYYY-MM-DD');
}

/** number of days, a - b */
export function dateDiff(a: number, b: number) {
  const diff = (a - b) / D1;
  if (Math.round(diff) !== diff) console.error(new Error('bad timestamps'));
  return Math.round(diff);
}

export function dateStartOfWeek(d: number, isInputNotUTC: boolean = true) {
  let selectedDay = dayjs.unix(dateTS(d, isInputNotUTC)).utc();
  selectedDay = selectedDay.subtract(selectedDay.day(), 'days');
  return selectedDay.unix();
}

/** format a date.
 *  @see https://day.js.org/docs/en/display/format
 */
export function dateFormat(date: number, format: string) {
  return dayjs.unix(date).utc().format(format);
}

/** go from a date timestamp to a local timestamp. */
export function dateTSLocal(d: number) {
  const datestring = dateFormat(d, 'YYYY-MM-DD');
  return dayjs(datestring, 'YYYY-MM-DD').unix();
}

// ------------------------------------
// hooks

export function useDatesArray(p: CalendarProps) {
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
