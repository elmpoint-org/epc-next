import dayjs from 'dayjs';

import type { PagePropType } from '../page';
import { clx } from '@/util/classConcat';
import { Fragment, useMemo } from 'react';

export default function PageStats({ page }: { page: PagePropType }) {
  const dateUpdated = useMemo(
    () => dayjs.unix(page.timestamp.updated).format('MMM D, YYYY'),
    [page],
  );

  return (
    <>
      <div
        className={clx(
          'space-x-2 py-2 text-slate-500',
          /* em */ '[&_em]:not-italic [&_em]:text-dblack',
        )}
      >
        {(
          [
            // contributors list
            !!page.contributors.length && (
              <>
                <span>
                  <span>Written by </span>
                  {page.contributors
                    .filter((it) => it?.name?.length)
                    .map((it) => (
                      <>
                        <em key={it!.id}>{it!.name}</em>
                        <span className="last:hidden">, </span>
                      </>
                    ))}
                </span>
              </>
            ),
            // updated date
            !!dateUpdated.length && (
              <span>
                <span>Last updated </span>
                <em className="text-nowrap">{dateUpdated}</em>
              </span>
            ),
          ] as React.ReactNode[]
        )
          .filter((it) => it)
          .map((it, i) => (
            <Fragment key={i}>
              {it}
              <span className="last:hidden">&bull;</span>
            </Fragment>
          ))}
      </div>
    </>
  );
}
