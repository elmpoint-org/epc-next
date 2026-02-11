import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { useCallback } from 'react';
import { ActionIcon, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import type { PhotoGalleryAtts } from './photoGalleryExt';
import { PhotoGalleryStable } from './PhotoGalleryStable';

export default function PhotoGalleryNodeComponent(
  props: ReactNodeViewProps<HTMLDivElement>,
) {
  const attrs = props.node.attrs as PhotoGalleryAtts;

  const handleChange = useCallback(
    (value: string) => {
      props.updateAttributes({
        folderPath: value,
      } satisfies Partial<PhotoGalleryAtts>);
    },
    [props],
  );

  const deleteMe = useCallback(() => props.deleteNode(), [props]);

  return (
    <NodeViewWrapper>
      {props.editor?.isEditable ? (
        <div
          ref={props.ref}
          className="relative my-4 rounded-md border border-slate-200 bg-slate-50 p-2"
        >
          {/* Editor-only controls */}
          <div className="mb-4 flex flex-row items-center gap-2 border-b border-slate-200 pb-2">
            <TextInput
              className="flex-1"
              label="CMS Folder Path"
              placeholder="/files/my-images/"
              size="xs"
              value={attrs.folderPath}
              onChange={(e) => handleChange(e.currentTarget.value)}
            />
            <div className="mt-5">
              <ActionIcon color="red" variant="subtle" onClick={deleteMe}>
                <IconX size={16} />
              </ActionIcon>
            </div>
          </div>

          {/* The Actual Display */}
          <PhotoGalleryStable folderPath={attrs.folderPath} />
        </div>
      ) : (
        <PhotoGalleryStable folderPath={attrs.folderPath} />
      )}
    </NodeViewWrapper>
  );
}
