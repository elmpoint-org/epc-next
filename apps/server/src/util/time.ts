export function getDateSec(date?: Date | null) {
  if (!(date instanceof Date)) return null;
  return Math.round(date.valueOf() / 1000);
}
