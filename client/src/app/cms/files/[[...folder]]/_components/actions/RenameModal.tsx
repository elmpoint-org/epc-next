import { useEffect, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { graphAuth, graphql } from '@/query/graphql';

import FileModal, { FileModalProps } from './FileModal';

export default function RenameModal(props: { path: string } & FileModalProps) {
  const { show, onHide, path, currentFolder } = props;
  const filename = path?.replace(currentFolder, '') ?? '';

  const [text, setText] = useState('');
  // on load
  useEffect(() => {
    if (!show) return;
    setText(filename);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const [isLoading, loading] = useTransition();
  function handleSubmit() {
    if (!text.length || text.match('/'))
      return notifications.show({ color: 'red', message: 'Invalid file name' });

    loading(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation CmsFileMove(
            $changes: [CMSFileMoveChanges!]!
            $copy: Boolean
          ) {
            cmsFileMove(changes: $changes, copy: $copy)
          }
        `),
        {
          copy: false,
          changes: [
            {
              path: currentFolder + filename,
              newPath: currentFolder + text.trim(),
            },
          ],
        },
      );
      if (errors || !data?.cmsFileMove) {
        notifications.show({
          color: 'red',
          message: 'An error occurred.',
        });
        return;
      }

      onHide?.(true);
    });
  }

  return (
    <>
      <FileModal opened={show} onClose={() => onHide?.()} title="Rename file">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2 text-sm">
            <p className="">
              Choose a new name for{' '}
              <em className="-my-1.5 rounded-md bg-slate-200 p-1.5 font-bold not-italic">
                {filename}
              </em>
              .
            </p>

            <hr className="mt-3" />

            <div className="py-4">
              <TextInput
                placeholder="filename.jpg"
                label="New name"
                value={text}
                onChange={({ currentTarget: { value: v } }) => setText(v)}
                rightSection={<CloseButton onClick={() => setText('')} />}
              />
            </div>
          </div>

          <div className="h-2"></div>

          <div className="flex flex-row justify-end">
            <Button type="submit" loading={isLoading}>
              Rename
            </Button>
          </div>
        </form>
      </FileModal>
    </>
  );
}
