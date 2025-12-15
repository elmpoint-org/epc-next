import type { HomeBannerType } from '@/app/_components/home/homeBanners';
import { dateTS, unixNow } from '@epc/date-ts';

/**
 * @example
 * banners.sort(sortBanners());
 */
export function sortBanners<T extends HomeBannerType>(): (
  a: T,
  b: T,
) => number {
  return (a, b) => {
    return (
      // empty text goes first
      (a.text.length > 0 ? 1 : 0) - (b.text.length > 0 ? 1 : 0) ||
      // current items second
      (isCurrent(b) ? 1 : 0) - (isCurrent(a) ? 1 : 0) ||
      // break ties by most recent date_created
      (b.timestamp.created ?? 0) - (a.timestamp.created ?? 0)
    );

    function isCurrent(banner: HomeBannerType) {
      const now = dateTS(unixNow());
      const afterStart = banner.date_start === null || banner.date_start <= now;
      const beforeEnd = banner.date_end === null || banner.date_end >= now;
      return afterStart && beforeEnd;
    }
  };
}
