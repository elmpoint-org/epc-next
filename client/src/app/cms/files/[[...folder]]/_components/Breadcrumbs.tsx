import { Fragment, useMemo } from 'react';
import { Children } from '@/util/propTypes';

import { IconHome2 } from '@tabler/icons-react';

import { FileManagerProps } from './FileManager';
import A from '@/app/_components/_base/A';

const HOME_FOLDER_PREFIX = (
  <IconHome2
    className="-mt-1 inline size-5 hover:fill-dgreen/15"
    stroke={1.5}
  />
);

export default function Breadcrumbs({ folder, setFolder }: FileManagerProps) {
  const crumbs = useMemo(() => {
    let vals: string[] = [];
    const r = /([^\/]+)(?:\/|$)/g;
    let l: RegExpMatchArray | null = null;
    while ((l = r.exec(folder)) !== null) if (l?.[1]) vals.push(l[1]);
    vals.unshift('');
    return vals;
  }, [folder]);

  const getFullCrumbPath = (i: number) =>
    crumbs.slice(0, i + 1).join('/') + '/';

  return (
    <>
      <div className="flex flex-row items-center gap-1">
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            <Breadcrumb
              path={getFullCrumbPath(i)}
              onClick={() => setFolder(getFullCrumbPath(i))}
            >
              {crumb.length ? crumb : HOME_FOLDER_PREFIX}
            </Breadcrumb>
            <span>/</span>
          </Fragment>
        ))}
      </div>
    </>
  );
}

function Breadcrumb({
  path,
  onClick,
  children,
}: { path: string; onClick?: () => void } & Children) {
  return (
    <>
      <A
        href={'/cms/files' + path}
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className="font-normal"
      >
        {children}
      </A>
    </>
  );
}
