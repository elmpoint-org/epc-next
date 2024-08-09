import { useSkeleton } from '@/app/_ctx/skeleton/context';

import { ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

import Breadcrumbs from './Breadcrumbs';
import { FileManagerProps } from './FileManager';

export default function FilesActionBar(folderProps: FileManagerProps) {
  const { folder, setFolder } = folderProps;

  const isSkeleton = useSkeleton();

  return (
    <>
      <div
        className="group relative flex flex-row items-center gap-3 rounded-md border border-slate-300 p-3 px-4 data-[s]:border-transparent"
        data-s={isSkeleton || null}
      >
        {/* back button */}
        <ActionIcon
          variant="subtle"
          size="sm"
          color="black"
          onClick={() => {
            let m = folder.match(/^(.+\/)[^\/]+\/?$/);
            if (m?.[1]) return setFolder(m[1]);
            m = folder.match(/^[^\/]+\/?$/);
            if (m) return setFolder('');
          }}
        >
          <IconArrowLeft />
        </ActionIcon>

        {/* breadcrumbs */}
        <Breadcrumbs {...folderProps} />

        {/* actions */}
        <div className="flex flex-row items-center gap-2">
          {/* TODO */}
          {/*  */}
        </div>

        {isSkeleton && (
          <div className="absolute inset-0 bg-dwhite">
            <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-200" />
          </div>
        )}
      </div>
    </>
  );
}
