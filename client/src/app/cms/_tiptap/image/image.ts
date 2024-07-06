import ImageRoot from '@tiptap/extension-image';

import { mergeAttributes } from '@tiptap/core';
import {
  getTypedAtt,
  type TextAlignEnum,
  type AddAttributes,
} from '../../_util/extensionUtils';

const DEFAULT_IMAGE_WIDTH = 1000;

// TYPE DEFINITIONS
export const ImageTypeName = 'imageBlock';
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlockAt: (
        pos: number,
        atts: {
          src: string;
          imgWidth: number;
        },
      ) => ReturnType;
      setImageBlockWidth: (percent: number) => ReturnType;
    };
  }
}
export type ImageTypeAtts = {
  src: string;
  percent: string;
  imgWidth: string;
  textAlign: TextAlignEnum;
};

type Atts = ImageTypeAtts;
const att = getTypedAtt<Atts>();

// EXTENSION
export const Image = ImageRoot.extend({
  name: ImageTypeName,

  group: 'block',
  defining: true,
  isolating: true,
  draggable: false,

  addAttributes(): AddAttributes<Atts> {
    return {
      src: { default: '' },
      percent: att({
        att: 'percent',
        data: 'data-percent',
        default: '100',
      }),
      imgWidth: att({
        att: 'imgWidth',
        data: 'data-img-width',
        default: '',
      }),
      textAlign: att({
        att: 'textAlign',
        data: 'data-align',
        default: 'center',
      }),
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    // calculate width
    const atts = node.attrs as Atts;
    let percent = parseInt(atts.percent);
    let img = parseInt(atts.imgWidth);
    if (!Number.isFinite(percent)) percent = 100;
    if (!Number.isFinite(img)) img = DEFAULT_IMAGE_WIDTH;
    const px = Math.round((percent / 100) * img);

    return [
      'img',
      mergeAttributes(HTMLAttributes, this.options.HTMLAttributes, {
        style: `width: ${px}px`,
      }),
    ];
  },

  addCommands() {
    return {
      setImageBlockAt:
        (pos, { src, imgWidth }) =>
        ({ commands }) =>
          commands.insertContentAt(pos, {
            type: ImageTypeName,
            attrs: {
              src,
              imgWidth: '' + imgWidth,
            } as Partial<Atts>,
          }),
      setImageBlockWidth:
        (percent) =>
        ({ commands }) =>
          commands.updateAttributes(ImageTypeName, {
            percent: '' + percent,
          } as Partial<Atts>),
    };
  },
}).configure({
  //
});
