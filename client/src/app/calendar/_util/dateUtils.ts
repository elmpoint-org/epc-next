import dayjsRoot from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjsRoot.extend(utc);

export const dayjs = dayjsRoot;

/** one day in seconds */
export const D1 = 24 * 3600;

export function dateTS(d: Date | number) {
  const day = d instanceof Date ? dayjs(d) : dayjs.unix(d);
  return day.utc(true).startOf('date').unix();
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
