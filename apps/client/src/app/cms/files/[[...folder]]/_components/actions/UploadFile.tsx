import { ActionIcon } from '@mantine/core';
import {
  IconCheck,
  IconFileFilled,
  IconLoader2,
  IconTrash,
  IconX,
} from '@tabler/icons-react';

import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';
import { graphAuth, graphql } from '@/query/graphql';
import { notifications } from '@mantine/notifications';
import { IconType } from '@/util/iconType';
import { clmx } from '@/util/classConcat';
import { useState } from 'react';

export default function UploadFile({
  file,
  startUpload,
  currentFolder,
  onRemove,
  onComplete,
}: {
  file: File;
  onRemove: () => void;
  onComplete?: () => void;
  startUpload: ReverseCbProp;
  currentFolder: string;
}) {
  const [status, setStatus] = useState<
    'DEFAULT' | 'UPLOADING' | 'FAILED' | 'SUCCESS'
  >('DEFAULT');
  const [progress, setProgress] = useState(0);

  // on upload start...
  useReverseCb(startUpload, async () => {
    setStatus('UPLOADING');

    const { data, errors } = await graphAuth(
      graphql(`
        mutation CmsFileUpload($fileName: String!, $root: String!) {
          cmsFileUpload(fileName: $fileName, root: $root) {
            url
          }
        }
      `),
      {
        fileName: file.name,
        root: currentFolder,
      },
    );
    if (errors || !data?.cmsFileUpload) {
      // TODO handle better
      console.log(errors?.[0].code ?? errors);
      setStatus('FAILED');
      return;
    }

    const { url } = data.cmsFileUpload;
    runUpload(url);
  });

  async function runUpload(url: string) {
    const xhr = new XMLHttpRequest();
    const success = await new Promise<boolean>((resolve) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setProgress(e.loaded / e.total);
        }
      });
      xhr.addEventListener('loadend', () =>
        resolve(xhr.readyState === 4 && xhr.status === 200),
      );

      xhr.open('PUT', url, true);
      xhr.send(file);
    });
    setStatus(success ? 'SUCCESS' : 'FAILED');
    onComplete?.();
  }

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-slate-200 p-2">
        <div className="flex flex-row items-center px-1">
          <div className="flex flex-1 flex-row items-center gap-1.5 truncate">
            {/* status */}
            {status === 'DEFAULT' && <StatusIcon icon={IconFileFilled} />}
            {status === 'UPLOADING' && (
              <StatusIcon icon={IconLoader2} className="animate-spin" />
            )}
            {status === 'SUCCESS' && (
              <StatusIcon icon={IconCheck} className="text-emerald-700" />
            )}
            {status === 'FAILED' && (
              <StatusIcon icon={IconX} className="text-red-700" />
            )}

            {/* file name */}
            <span className="truncate">{file.name}</span>
          </div>

          {/* remove button */}
          <ActionIcon
            size="sm"
            color="slate"
            variant="subtle"
            onClick={() => onRemove()}
            disabled={status !== 'DEFAULT'}
          >
            <IconTrash />
          </ActionIcon>
        </div>

        {/* upload loading bar */}
        <div className="relative mx-2 my-2 flex h-2 flex-row overflow-hidden rounded-full">
          <div
            className="max-w-full bg-emerald-600"
            style={{ width: `${progress * 100}%` }}
          ></div>
          <div className="flex-1 bg-slate-400/50"></div>
        </div>
      </div>
    </>
  );
}

function StatusIcon({
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
          size={16}
          className={clmx('shrink-0 text-slate-500/80', className)}
        />
      </div>
    </>
  );
}
