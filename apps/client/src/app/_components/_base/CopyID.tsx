'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import { MouseEventHandler, useCallback } from 'react';

export default function CopyID({ id }: { id: string }) {
  const cbCopy = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard.writeText(id);
    },
    [id],
  );

  return (
    <>
      <div className="flex flex-row justify-end">
        <Tooltip label={'Copy ID'}>
          <ActionIcon onClick={cbCopy} color="slate" size="xs" variant="subtle">
            <IconCode />
          </ActionIcon>
        </Tooltip>
      </div>
    </>
  );
}
