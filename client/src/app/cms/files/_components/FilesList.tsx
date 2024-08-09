import { IconLoader2 } from '@tabler/icons-react';

import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { FileManagerProps } from './FileManager';

import Checkbox from './Checkbox';

export default function FilesList({
  files,
  setFolder,
  folderParsed,
  newLoad,
}: { newLoad?: boolean } & FileManagerProps) {
  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="rounded-lg bg-slate-200 p-4">
        {/* files list */}
        <div className="flex flex-col gap-2">
          {files?.map((f) => (
            <div
              key={f.path}
              tabIndex={0}
              className="flex flex-row justify-between rounded-md bg-slate-100 px-4 py-2"
            >
              {/* left section */}
              <div className="flex flex-row items-center gap-4">
                {/* checkbox */}
                <Checkbox />

                {/* file/folder name link */}
                <div className="t">
                  {f.path.at(-1) === '/' ? (
                    // folder
                    <>
                      <button
                        className="hover:text-emerald-700 hover:underline"
                        onClick={() => setFolder(f.path)}
                      >
                        {f.path.replace(folderParsed, '')}
                      </button>
                    </>
                  ) : (
                    // file
                    <>
                      <a
                        className="hover:text-emerald-700 hover:underline"
                        href={`/cms/file/${f.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {f.path.replace(folderParsed, '')}
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* SKELETON */}
          {isSkeleton &&
            Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 animate-pulse flex-row justify-between rounded-md bg-slate-100 px-4 py-1"
                  style={{ opacity: 1 - 0.15 * i }}
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
