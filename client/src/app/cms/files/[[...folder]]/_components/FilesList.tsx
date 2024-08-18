import { Fragment } from 'react';

import { Checkbox as MantineCheckbox } from '@mantine/core';
import { IconCheck, IconLoader2 } from '@tabler/icons-react';

import { useSkeleton } from '@/app/_ctx/skeleton/context';

import { FileManagerProps } from './FileManager';
import FilesListItem from './FilesListItem';
import SelectionActions from './SelectionActions';

export default function FilesList({
  newLoad,
  ...props
}: { newLoad?: boolean } & FileManagerProps) {
  const { files, select } = props;
  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-slate-200 p-4">
        {/* selection actions */}
        <SelectionActions totalFiles={files?.length} {...props} />

        {/* files list */}
        <div className="flex flex-col gap-2">
          {files?.map((f) => (
            <Fragment key={f.path}>
              <FilesListItem file={f} {...props} />
            </Fragment>
          ))}

          {/* SKELETON */}
          {isSkeleton &&
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 animate-pulse flex-row justify-between rounded-md bg-slate-100 px-4 py-1"
                  style={{ opacity: 1 - 0.1 * i }}
                />
              ))}

          {/* new folder loader */}
          {!isSkeleton && !files?.length && newLoad && (
            <div className="flex flex-row justify-center">
              <div className="animate-spin text-dgreen">
                <IconLoader2 className="size-8" />
              </div>
            </div>
          )}

          {/* no files message */}
          <div className="hidden px-2 text-sm italic text-slate-600 first:block">
            no files
          </div>
        </div>
      </div>
    </>
  );
}
