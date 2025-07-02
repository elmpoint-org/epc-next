import { useRef, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { graphAuth, graphql } from '@/query/graphql';

import { ModalFrame, ModalFrameFooter, FileModalProps } from '@/app/_components/_base/ModalFrame';
import FocusOnRender from '@/app/_components/_base/FocusOnRender';

export default function NewFolderModal(props: FileModalProps) {
  const { show, onHide, currentFolder } = props;

  const [text, setText] = useState('');
  const textboxRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, loading] = useTransition();
  function handleSubmit() {
    if (!text.length || text.match('/'))
      return notifications.show({ color: 'red', message: 'Invalid file name' });

    loading(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation CmsFileCreateFolder($root: String!) {
            cmsFileCreateFolder(root: $root)
          }
        `),
        { root: currentFolder + text.trim() + '/' },
      );
      if (errors || !data?.cmsFileCreateFolder) {
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
      <ModalFrame open={show} onClose={() => onHide()} title="Create New Folder">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            {/* body text */}
            <p className="text-sm leading-relaxed">
              Enter a name for the folder.
            </p>

            <TextInput
              placeholder="New Folder"
              aria-label="Folder name"
              ref={textboxRef}
              value={text}
              onChange={({ currentTarget: { value: v } }) => setText(v)}
              rightSection={<CloseButton onClick={() => setText('')} />}
            />
            <FocusOnRender el={textboxRef} />

            <ModalFrameFooter>
              <div className="flex flex-row justify-end">
                <Button type="submit" loading={isLoading}>
                  Create
                </Button>
              </div>
            </ModalFrameFooter>
          </div>
        </form>
      </ModalFrame>
    </>
  );
}
