import { clx } from '@/util/classConcat';
import { graphql } from '@/query/graphql';
import { ExtractLiterals } from '@/util/inferTypes';
import { ResultOf } from '@graphql-typed-document-node/core';

export const BANNER_COLORS = {
  green: {
    box: clx('border-emerald-600 bg-emerald-400/30 text-emerald-800'),
    link: clx('text-emerald-700'),
  },
  red: {
    box: clx('border-red-600 bg-red-300/30 text-red-800'),
    link: clx('text-red-700'),
  },
  orange: {
    box: clx('border-orange-600 bg-orange-300/30 text-orange-800'),
    link: clx('text-orange-700'),
  },
  yellow: {
    box: clx('border-yellow-600 bg-yellow-200/30 text-yellow-900'),
    link: clx('text-yellow-700'),
  },
  blue: {
    box: clx('border-sky-600 bg-sky-200/30 text-sky-900'),
    link: clx('text-sky-700'),
  },
  purple: {
    box: clx('border-purple-600 bg-purple-300/30 text-purple-800'),
    link: clx('text-purple-700'),
  },
  gray: {
    box: clx('border-slate-400 bg-slate-200 text-slate-800'),
    link: clx('text-slate-700'),
  },
} satisfies Record<HomeBannerColor, { box: string; link: string }>;
export const ColorNames = Object.keys(BANNER_COLORS) as HomeBannerColor[];

export const HOME_BANNER_FRAGMENT = graphql(`
  fragment HomeBanner on CMSBanner @_unmask {
    id
    text
    link {
      text
      href
    }
    color
    date_start
    date_end
    timestamp {
      created
    }
  }
`);
export const HOME_BANNERS_NOW_QUERY = graphql(
  `
    query CmsBannersNow {
      cmsBannersNow {
        ...HomeBanner
      }
    }
  `,
  [HOME_BANNER_FRAGMENT],
);
export type HomeBannerType = ResultOf<typeof HOME_BANNER_FRAGMENT>;
export type HomeBannerColor = ExtractLiterals<HomeBannerType['color']>;
