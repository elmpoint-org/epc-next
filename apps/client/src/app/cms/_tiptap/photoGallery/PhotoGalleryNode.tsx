import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { ActionIcon, Checkbox, TextInput } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

import type { PhotoGalleryAtts } from './photoGalleryExt';
import { PhotoGallery } from './component/PhotoGallery';
import { clx } from '@/util/classConcat';
import { siteDomain } from '@/util/dev';
import A from '@/app/_components/_base/A';

export default function PhotoGalleryNodeComponent(
  props: ReactNodeViewProps<HTMLDivElement>,
) {
  const attrs = props.node.attrs as PhotoGalleryAtts;

  const [textValue, setTextValue] = useState(
    attrs.folder ? `${siteDomain}/cms/files/${attrs.folder}` : '',
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => {
      setTextValue(value);

      // get folder path
      let path = null;
      try {
        const url = new URL(value.trim());
        const m = url.pathname.match(/^\/cms\/files\/(.+)/i);
        path = decodeURIComponent(m?.[1] ?? '');
      } catch (_) {}
      if (!path) return;

      // process path
      // trailing slash
      if (path.at(-1) !== '/') path = path + '/';

      props.updateAttributes({
        folder: path,
      } satisfies Partial<PhotoGalleryAtts>);
    },
    [props],
  );

  const deleteMe = useCallback(() => props.deleteNode(), [props]);

  const [showImages, setShowImages] = useState(false);

  const COMPONENT = <PhotoGallery folder={attrs.folder} />;
  return (
    <NodeViewWrapper>
      {props.editor?.isEditable ? (
        // WITH EDITOR
        <div ref={props.ref} data-drag-handle className="relative">
          <div
            className={clx(
              'not-prose overflow-hidden rounded-md border border-slate-300 p-2 hover:border-slate-400',
              /* selected */ 'pmp-selected:border-slate-900',
            )}
          >
            {/* CONTROLS */}
            <div className="-m-2 mb-4 flex flex-col gap-2 border-b border-slate-300 bg-slate-200 p-4">
              <h4 className="text-base/snug font-bold">Image Gallery</h4>
              <p className="text-sm">
                Upload your images to a <b>new folder</b> in{' '}
                <A href="/cms/files" target="_blank" rel="noopener noreferrer">
                  File Manager
                </A>
                . Open that folder and copy the URL into the box below. This
                page will keep itself updated as you add/remove photos.
              </p>
              <TextInput
                className="flex-1"
                aria-label="CMS Folder URL"
                placeholder={`${siteDomain}/cms/files/albums/MyPhotoAlbum/`}
                value={textValue}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2 flex flex-col items-center gap-2 p-2">
              <div className="text-center text-sm">
                {attrs.folder.length ? (
                  <>
                    Photos uploaded to{' '}
                    <A href={`/cms/files/${attrs.folder}`}>/{attrs.folder}</A>{' '}
                    will be shown here.
                  </>
                ) : (
                  <span className="italic text-slate-400">
                    Enter a folder’s URL above.
                  </span>
                )}
              </div>

              <Checkbox
                checked={showImages}
                onChange={() => setShowImages((c) => !c)}
                size="xs"
                disabled={!attrs.folder.length}
                label={<>Show images while editing (may be slow)</>}
              />
            </div>

            {showImages && (
              <>
                <hr className="mb-4 border-slate-200" />
                {COMPONENT}
              </>
            )}
          </div>

          {/* DELETE BUTTON */}
          <div className="invisible absolute -right-2 -top-2 pmp-selected:visible">
            <ActionIcon size="xs" color="slate" onClick={deleteMe}>
              <IconX />
            </ActionIcon>
          </div>
        </div>
      ) : (
        // WITHOUT EDITOR
        COMPONENT
      )}
    </NodeViewWrapper>
  );
}
