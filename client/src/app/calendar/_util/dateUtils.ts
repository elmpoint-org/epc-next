import { useMemo } from 'react';
import { CalendarProps } from '../_components/Calendar';

import dayjsRoot from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjsRoot.extend(utc);

export const dayjs = dayjsRoot;

/** one day in seconds */
export const D1 = 24 * 3600;

/** convert to date timestamp.
 *
 * **By default, `isInputNotUTC` is true**, meaning the date from your current timezone will be taken. set to `false` to take the date at UTC time. */
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

/** go from a date timestamp to a JS Date object. */
export function TStoDate(d: number) {
  return new Date(dateTSLocal(d) * 1000);
}

// ------------------------------------
// hooks

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
