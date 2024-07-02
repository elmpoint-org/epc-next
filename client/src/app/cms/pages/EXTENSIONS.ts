import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';

export const STATIC_EXTENSIONS: Extensions = [
  StarterKit,
  Typography,
  Highlight,
  Underline,
  Superscript,
  Subscript,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
];
