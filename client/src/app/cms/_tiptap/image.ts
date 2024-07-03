import { clx } from '@/util/classConcat';

import ImageRoot from '@tiptap/extension-image';

import { mergeAttributes } from '@tiptap/core';
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlockAt: (attributes: { src: string; pos: number }) => ReturnType;
      setImageBlockWidth: (width: number) => ReturnType;
    };
  }
}

export const ImageTypeName = 'imageBlock';
export const Image = ImageRoot.extend({
  name: ImageTypeName,
  group: 'block',
  defining: true,
  isolating: true,
  draggable: false,

  addAttributes() {
    return {
      src: { default: '' },
      width: {
        default: '100',
        parseHTML: (el) => el.getAttribute('data-width'),
        renderHTML: ({ width }) => ({ 'data-width': width }),
      },
      textAlign: {
        default: 'center',
        parseHTML: (el) => el.getAttribute('data-align'),
        renderHTML: ({ textAlign }) => ({ 'data-align': textAlign }),
      },
    };
  },

  renderHTML(props) {
    return [
      'img',
      mergeAttributes(props.HTMLAttributes, this.options.HTMLAttributes, {
        style: `max-width: ${props.node.attrs.width}%`,
      }),
    ];
  },

  addCommands() {
    return {
      setImageBlockAt:
        ({ pos, src }) =>
        ({ commands }) =>
          commands.insertContentAt(pos, {
            type: ImageTypeName,
            attrs: {
              src,
            },
          }),
      setImageBlockWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes(ImageTypeName, { width: '' + width }),
    };
  },
}).configure({
  HTMLAttributes: {
    class: clx(
      'pm-selected:ring-2 max-w-full rounded-lg ring-dgreen ring-offset-2 data-[align=center]:mx-auto data-[align=right]:ml-auto',
    ),
  },
});
