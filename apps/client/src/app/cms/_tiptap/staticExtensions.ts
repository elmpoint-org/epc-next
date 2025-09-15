import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Youtube from '@tiptap/extension-youtube';
import { Image } from './image/image';

export const STATIC_EXTENSIONS: Extensions = [
  StarterKit.configure({ link: false }),
  Typography,
  Highlight,
  Superscript,
  Subscript,
  Image,
  TextStyle,
  Color,
  Youtube.configure({
    nocookie: true,
    rel: 0,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph', Image.name, Youtube.name],
  }),
];
