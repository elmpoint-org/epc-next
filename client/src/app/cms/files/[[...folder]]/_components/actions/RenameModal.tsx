import { useEffect, useRef, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { graphAuth, graphql } from '@/query/graphql';

import { FileModal, FileModalFooter, FileModalProps } from './FileModal';
import FocusOnRender from '@/app/_components/_base/FocusOnRender';
import OverwriteWarning from '../OverwriteWarning';

export default function RenameModal(
  props: { path: string; folderContents: string[] } & FileModalProps,
) {
  const { show, onHide, path, currentFolder, folderContents } = props;
  const filename = path?.replace(currentFolder, '') ?? '';

  const [text, setText] = useState('');

  // on load
  useEffect(() => {
    if (!show) return;
    setText(filename);
    setWarning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  const textboxRef = useRef<HTMLInputElement | null>(null);

  // conflicts warning
  const [warning, setWarning] = useState(false);

  const [isLoading, loading] = useTransition();
  function handleSubmit() {
    if (!text.length || text.match('/'))
      return notifications.show({ color: 'red', message: 'Invalid file name' });

    loading(async () => {
      // first, check for file conflicts in new location
      if (text.trim() === filename) return;
      if (!warning) {
        if (folderContents.includes(text.trim())) {
          setWarning(true);
          return;
        }
      }

      // run operation
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
        console.log(errors?.[0].code ?? errors);
        notifications.show({
          color: 'red',
          message: 'An error occurred.',
        });
        return;
      }

      onHide(true);
    });
  }

  return (
    <>
      <FileModal open={show} onClose={() => onHide()} title="Rename File">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed">
              Choose a new name for{' '}
              <em className="-my-0.5 rounded-md bg-slate-200 p-0.5 font-bold not-italic">
                {filename}
              </em>
              .
            </p>

            <TextInput
              placeholder="filename.jpg"
              aria-label="New filename"
              value={text}
              onChange={({ currentTarget: { value: v } }) => setText(v)}
              rightSection={<CloseButton onClick={() => setText('')} />}
              ref={textboxRef}
            />
            <FocusOnRender el={textboxRef} select />

            {warning && (
              <OverwriteWarning>
                A file already exists with that name and will be overwitten.
              </OverwriteWarning>
            )}

            <FileModalFooter>
              <div className="flex flex-row justify-end">
                <Button type="submit" loading={isLoading}>
                  Rename
                </Button>
              </div>
            </FileModalFooter>
          </div>
        </form>
      </FileModal>
    </>
  );
}
