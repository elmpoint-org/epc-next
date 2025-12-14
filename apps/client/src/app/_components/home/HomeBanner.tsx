'use client';

import { Fragment, useMemo } from 'react';
import { HomeBannerColor, HomeBannerType } from './homeBanners';
import { BANNER_COLORS } from './homeBanners';
import { IconArrowRight } from '@tabler/icons-react';
import A from '../_base/A';
import { clmx } from '@/util/classConcat';

const COLOR_DEFAULT: HomeBannerColor = 'gray';

export default function HomeBanner({
  color = 'green',
  link,
  text,
  className,
}: HomeBannerType & { className?: string }) {
  const color_styles = useMemo(
    () => BANNER_COLORS[color ?? COLOR_DEFAULT],
    [color],
  );
  return (
    <div
      className={clmx(
        'flex flex-col gap-2 rounded-lg border px-4 py-2 backdrop-blur-sm md:flex-row md:items-center md:gap-4',
        color_styles.box,
        className,
      )}
    >
      <p className="flex-1">
        {!text.length ? (
          <em>(new alert)</em>
        ) : (
          text.split('\n').map((c, i) => (
            <Fragment key={i}>
              {!!i && <br />}
              {c}
            </Fragment>
          ))
        )}
      </p>
      {link && (
        <div className="self-end md:self-auto">
          <A href={link.href} className={color_styles.link}>
            {link.text || 'Go'}{' '}
            <IconArrowRight className="-mt-0.5 inline size-4" />
          </A>
        </div>
      )}
    </div>
  );
}
