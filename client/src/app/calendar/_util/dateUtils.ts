import dayjsRoot from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjsRoot.extend(utc);

export const dayjs = dayjsRoot;

export function dateTS(d: Date | number) {
  const day = d instanceof Date ? dayjs(d) : dayjs.unix(d);
  return day.utc(true).startOf('date').unix();
}
