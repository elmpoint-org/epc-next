import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function dateTS(d: Date | number) {
  const day = d instanceof Date ? dayjs(d) : dayjs.unix(d);
  return day.utc(true).unix();
}
