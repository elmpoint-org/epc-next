import { useMemo } from 'react';
import Link from 'next/link';

import { Inside } from '@/util/inferTypes';

import { FileManagerProps } from './FileManager';
import Checkbox from './Checkbox';
import { ActionIcon } from '@mantine/core';
import {
  IconFileFilled,
  IconFolder,
  IconFolderFilled,
  IconLink,
} from '@tabler/icons-react';
import { siteDomain } from '@/util/dev';
import { IconType } from '@/util/iconType';
import { clmx } from '@/util/classConcat';

export default function FilesListItem({
  file,
  folderParsed,
  select,
}: { file: FileType } & FileManagerProps) {
  const isSelected = useMemo(
    () => select.isSelected(file.path),
    [file.path, select],
  );

  const isFolder = file.path.at(-1) === '/';
  const fileHref = `/cms/file${isFolder ? 's' : ''}/${file.path}`;
  const readablePath = file.path.replace(folderParsed, '');

  return (
    <>
      <div
        onClick={(e) => {
          e.currentTarget.focus();
          select.toggle(file.path);
        }}
        data-s={isSelected || null}
        className="group py-1"
      >
        <div className="flex flex-row justify-between rounded-md border border-transparent bg-slate-100 px-4 py-2 transition-all group-hover:border-dgreen/50 group-data-[s]:border-dgreen group-data-[s]:bg-emerald-600/20">
          {/* left section */}
          <div className="flex flex-row items-center gap-4 truncate">
            {/* checkbox */}
            <Checkbox
              checked={isSelected}
              onChange={(v) =>
                v
                  ? select.selectFile(file.path)
                  : select.deselectFile(file.path)
              }
            />

            {/* file/folder name link */}
            <div className="flex flex-row gap-2 truncate group-data-[s]:font-bold group-data-[s]:text-dgreen">
              {/* file type icon */}
              <FileIcon icon={isFolder ? IconFolderFilled : IconFileFilled} />

              {isFolder ? (
                // folder
                <>
                  <Link
                    className="hover:text-emerald-700 hover:underline"
                    href={fileHref}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {readablePath}
                  </Link>
                </>
              ) : (
                // file
                <>
                  <a
                    className="hover:text-emerald-700 hover:underline"
                    href={fileHref}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {readablePath}
                  </a>
                </>
              )}
            </div>
          </div>

          {/* copy link button */}
          {!isFolder && (
            <ActionIcon
              size="sm"
              variant="subtle"
              className="invisible group-hover:visible"
              onClick={(e) => {
                e.stopPropagation();
                prompt(
                  'Press Cmd/Ctrl+C to copy the file URL.',
                  siteDomain + fileHref,
                );
              }}
            >
              <IconLink />
            </ActionIcon>
          )}
        </div>
      </div>
    </>
  );
}

type FileType = Inside<FileManagerProps['files']>;

function FileIcon({
  icon: Icon,
  className,
}: {
  icon: IconType;
  className?: string;
}) {
  return (
    <>
      <div className="flex items-center justify-center">
        <Icon
          className={clmx(
            'size-5 text-slate-400 group-data-[s]:text-dgreen',
            className,
          )}
        />
      </div>
    </>
  );
}
