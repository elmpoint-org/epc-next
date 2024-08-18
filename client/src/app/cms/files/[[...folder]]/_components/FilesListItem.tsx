import { useMemo } from 'react';
import Link from 'next/link';

import { Inside } from '@/util/inferTypes';

import { FileManagerProps } from './FileManager';
import Checkbox from './Checkbox';

export default function FilesListItem({
  file: f,
  folderParsed,
  select,
}: { file: FileType } & FileManagerProps) {
  const isSelected = useMemo(() => select.isSelected(f.path), [f.path, select]);

  return (
    <>
      <div
        onClick={(e) => {
          e.currentTarget.focus();
          select.toggle(f.path);
        }}
        data-s={isSelected || null}
        className="group py-1"
      >
        <div className="flex flex-row justify-between rounded-md border border-transparent bg-slate-100 px-4 py-2 transition-all group-hover:border-dgreen/50 group-data-[s]:border-dgreen group-data-[s]:bg-emerald-600/20">
          {/* left section */}
          <div className="flex flex-row items-center gap-4">
            {/* checkbox */}
            <Checkbox
              checked={isSelected}
              onChange={(v) =>
                v ? select.selectFile(f.path) : select.deselectFile(f.path)
              }
            />

            {/* file/folder name link */}
            <div className="group-data-[s]:font-bold group-data-[s]:text-dgreen">
              {f.path.at(-1) === '/' ? (
                // folder
                <>
                  <Link
                    className="hover:text-emerald-700 hover:underline"
                    href={`/cms/files/${f.path}`}
                  >
                    {f.path.replace(folderParsed, '')}
                  </Link>
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
      </div>
    </>
  );
}

type FileType = Inside<FileManagerProps['files']>;
