import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { Image } from './image/image';
import TextAlign from '@tiptap/extension-text-align';

export const STATIC_EXTENSIONS: Extensions = [
  StarterKit,
  Typography,
  Highlight,
  Underline,
  Superscript,
  Subscript,
  Image,
  TextAlign.configure({ types: ['heading', 'paragraph', Image.name] }),
];
