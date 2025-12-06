import { IconArrowRight } from '@tabler/icons-react';
import A from '../_base/A';
import { clx } from '@/util/classConcat';
import { BANNER_COLORS } from './homeBannerColors';
import { graphAuthServer } from '@/query/graphql.server';
import { graphql } from '@/query/graphql';
import { ResultOf } from '@graphql-typed-document-node/core';
import { ExtractLiterals, Inside } from '@/util/inferTypes';

const HOME_BANNERS_QUERY = graphql(`
  query CmsBannersNow {
    cmsBannersNow {
      id
      text
      link {
        text
        href
      }
      color
    }
  }
`);
export type HomeBannerType = Inside<
  ResultOf<typeof HOME_BANNERS_QUERY>['cmsBannersNow']
>;
export type HomeBannerColor = ExtractLiterals<HomeBannerType['color']>;

const COLOR_DEFAULT: HomeBannerColor = 'green';
export default function HomeBanner({
  color = 'green',
  link,
  text,
}: HomeBannerType) {
  const color_styles = BANNER_COLORS[color ?? COLOR_DEFAULT];

  return (
    <>
      <div
        className={clx(
          'flex flex-col items-center rounded-lg border px-4 py-2 md:flex-row md:gap-4',
          color_styles.box,
        )}
      >
        <p className="flex-1">{text}</p>
        {link && (
          <div className="self-end md:self-auto">
            <A href={link.href} className={color_styles.link}>
              {link.text} <IconArrowRight className="-mt-0.5 inline size-4" />
            </A>
          </div>
        )}
      </div>
    </>
  );
}

export async function HomeBannerList() {
  const { data, errors } = await graphAuthServer(HOME_BANNERS_QUERY);
  if (errors || !data?.cmsBannersNow) return null;
  const items = data.cmsBannersNow;

  if (!items.length) return null;
  return (
    <div className={clx('mx-2 -mt-4 flex flex-col gap-2')}>
      {items.map((item) => (
        <HomeBanner key={item.id} {...item} />
      ))}
    </div>
  );
}
