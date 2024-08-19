import { ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

import Breadcrumbs from './Breadcrumbs';
import { FileManagerProps } from './FileManager';

export default function FilesPathBar(props: FileManagerProps) {
  const { folder, setFolder } = props;

  return (
    <>
      <div className="group relative flex flex-row items-center gap-3 rounded-md border border-slate-300 p-3 px-4">
        {/* back button */}
        <ActionIcon
          variant="subtle"
          size="sm"
          color="slate"
          onClick={() => {
            let m = folder.match(/^(.+\/)[^\/]+\/?$/);
            if (m?.[1]) return setFolder(m[1]);
            m = folder.match(/^\/?[^\/]+\/?$/);
            if (m) return setFolder('');
          }}
        >
          <IconArrowLeft />
        </ActionIcon>

        {/* breadcrumbs */}
        <Breadcrumbs {...props} />
      </div>
    </>
  );
}
