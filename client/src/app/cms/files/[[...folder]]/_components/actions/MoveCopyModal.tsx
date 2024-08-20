import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

import { Button, CloseButton, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { graphAuth, graphql } from '@/query/graphql';

import { FileModal, FileModalFooter, FileModalProps } from './FileModal';
import FocusOnRender from '@/app/_components/_base/FocusOnRender';

export default function MoveCopyModal(
  props: { selected: string[] } & FileModalProps,
) {
  const { show, onHide, currentFolder, selected } = props;

  const filenames = selected.map((path) => path.replace(currentFolder, ''));

  const [text, setText] = useState('');
  const textboxRef = useRef<HTMLInputElement | null>(null);

  // show folder on load
  useEffect(() => {
    if (!show) return;
    setText('/' + currentFolder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // parse folder
  const parsed = useMemo(() => {
    let f = text.trim();
    f = f.length && f.at(-1) !== '/' ? f + '/' : f;
    if (f.at(0) === '/') f = f.slice(1);
    return f;
  }, [text]);

  // submit
  const [isLoading, loading] = useTransition();
  function handleSubmit(shouldCopy: boolean) {
    loading(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation CmsFileMove(
            $changes: [CMSFileMoveChanges!]!
            $copy: Boolean
            $root: String!
          ) {
            cmsFileMove(changes: $changes, copy: $copy)
            cmsFileCreateFolder(root: $root)
          }
        `),
        {
          changes: filenames.map((name, i) => ({
            path: selected[i],
            newPath: parsed + name,
          })),
          copy: shouldCopy,
          root: parsed,
        },
      );
      if (errors || !data?.cmsFileMove) {
        console.log(errors?.[0].code ?? errors);
        notifications.show({ color: 'red', message: 'An error occurred.' });
        return;
      }

      onHide(true);
    });
  }

  return (
    <>
      <FileModal open={show} onClose={() => onHide()} title="Move/Copy Files">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(true);
          }}
        >
          <div className="flex flex-col gap-4">
            {/* instructions */}
            <p className="text-sm leading-relaxed">
              <span>Choose the directory where you want to move or copy </span>
              <b>{filenames.length}</b>
              {` item${filenames.length !== 1 ? 's' : ''}`}.
            </p>

            <TextInput
              placeholder="new/folder/path/"
              aria-label="New folder path"
              ref={textboxRef}
              value={text}
              onChange={({ currentTarget: { value: v } }) => setText(v)}
              rightSection={<CloseButton onClick={() => setText('')} />}
            />
            <FocusOnRender el={textboxRef} />

            {/* footer */}
            <FileModalFooter>
              <div className="flex flex-row-reverse justify-start gap-2">
                <Button type="submit" loading={isLoading}>
                  Copy
                </Button>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleSubmit(false)}
                >
                  Move
                </Button>
              </div>
            </FileModalFooter>
          </div>
        </form>
      </FileModal>
    </>
  );
}
