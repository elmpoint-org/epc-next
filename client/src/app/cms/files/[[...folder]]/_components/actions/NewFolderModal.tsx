import { useEffect, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { graphAuth, graphql } from '@/query/graphql';

import FileModal, { FileModalProps } from './FileModal';

export default function NewFolderModal(props: FileModalProps) {
  const { show, onHide, currentFolder } = props;

  const [text, setText] = useState('');

  const [isLoading, loading] = useTransition();
  function handleSubmit() {

    console.log('what the hell');
    

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

      onHide?.(true);
    });
  }

  return (
    <>
      <FileModal
        opened={show}
        onClose={() => onHide?.()}
        title="Create new folder"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2 text-sm">
            <p className="">Enter the new folder name.</p>

            <hr className="mt-3" />

            <div className="py-4">
              <TextInput
                placeholder="New Folder"
                label="Folder name"
                value={text}
                onChange={({ currentTarget: { value: v } }) => setText(v)}
                rightSection={<CloseButton onClick={() => setText('')} />}
              />
            </div>
          </div>

          <div className="h-2"></div>

          <div className="flex flex-row justify-end">
            <Button type='submit' loading={isLoading}>Create</Button>
          </div>
        </form>
      </FileModal>
    </>
  );
}
