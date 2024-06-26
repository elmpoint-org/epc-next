import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const STATIC_EXTENSIONS: Extensions = [
  StarterKit,
  Highlight,
  Underline,
  Superscript,
  Subscript,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
];
