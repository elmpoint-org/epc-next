import { clx } from '@/util/classConcat';
import { HomeBannerColor } from './HomeBanner';

export const BANNER_COLORS = {
  green: {
    box: clx('border-emerald-600 bg-emerald-500/30 text-emerald-900'),
    link: clx('text-emerald-700'),
  },
  red: {
    box: clx('border-red-600 bg-red-500/30 text-red-900'),
    link: clx('text-red-700'),
  },
  orange: {
    box: clx('border-orange-600 bg-orange-500/30 text-orange-900'),
    link: clx('text-orange-700'),
  },
  yellow: {
    box: clx('border-yellow-600 bg-yellow-500/30 text-yellow-900'),
    link: clx('text-yellow-700'),
  },
  blue: {
    box: clx('border-sky-600 bg-sky-500/30 text-sky-900'),
    link: clx('text-sky-700'),
  },
  purple: {
    box: clx('border-purple-600 bg-purple-500/30 text-purple-900'),
    link: clx('text-purple-700'),
  },
} satisfies Record<HomeBannerColor, { box: string; link: string }>;
export const ColorNames = Object.keys(BANNER_COLORS) as HomeBannerColor[];
