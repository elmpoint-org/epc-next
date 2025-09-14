import { clx } from '@/util/classConcat';

import css from './proseStyles.module.css';

export const proseStyles = clx(
  'flex min-h-48 flex-col *:flex-1',
  /* prose */ 'prose max-w-none prose-slate prose-headings:first:mt-0 prose-p:first:mt-0',
  /* prose styles */ css.css,
);
