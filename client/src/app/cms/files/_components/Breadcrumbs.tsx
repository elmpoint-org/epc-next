import { Fragment, useMemo } from 'react';
import { Children } from '@/util/propTypes';

import { FileManagerProps } from './FileManager';

import A from '@/app/_components/_base/A';

const HOME_FOLDER_PREFIX = 'home';

export default function Breadcrumbs({ folder, setFolder }: FileManagerProps) {
  const crumbs = useMemo(() => {
    let vals: string[] = [];
    const r = /([^\/]+)(?:\/|$)/g;
    let l: RegExpMatchArray | null = null;
    while ((l = r.exec(folder)) !== null) if (l?.[1]) vals.push(l[1]);
    vals.unshift('');
    return vals;
  }, [folder]);

  return (
    <>
      <div className="flex flex-row items-center gap-1">
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            <Breadcrumb
              path={crumb}
              onClick={() => setFolder(crumbs.slice(0, i + 1).join('/') + '/')}
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
        href={'files/' + path}
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
