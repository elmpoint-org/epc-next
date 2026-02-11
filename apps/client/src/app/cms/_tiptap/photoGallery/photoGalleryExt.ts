import { mergeAttributes, Node } from '@tiptap/core';
import { AddAttributes, getTypedAtt } from '../../_util/extensionUtils';
import { ReactNodeViewRenderer } from '@tiptap/react';
import PhotoGalleryNodeComponent from './PhotoGalleryNode';

export const PhotoGalleryTypeName = 'photoGallery';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    photoGallery: {
      insertPhotoGallery: (pos: number) => ReturnType;
    };
  }
}

export type PhotoGalleryAtts = {
  folder: string;
};
type Atts = PhotoGalleryAtts;
const att = getTypedAtt<Atts>();

const DATA_NAME = 'data-node-photogallery';

export const PhotoGallery = Node.create({
  name: PhotoGalleryTypeName,
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes(): AddAttributes<Atts> {
    return {
      folder: att({
        att: 'folder',
        data: 'data-folder',
        default: '',
      }),
    };
  },

  addCommands() {
    return {
      insertPhotoGallery:
        (pos) =>
        ({ commands }) =>
          commands.insertContentAt(pos, {
            type: PhotoGalleryTypeName,
          }),
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NAME}]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NAME]: '',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PhotoGalleryNodeComponent);
  },
});
