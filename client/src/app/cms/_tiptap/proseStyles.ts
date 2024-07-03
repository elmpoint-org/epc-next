import { clx } from '@/util/classConcat';

import css from './proseStyles.module.css';

export const proseStyles = clx(
  'flex min-h-48 flex-col [&>*]:flex-1',
  /* prose */ 'prose prose-slate max-w-none first:prose-headings:mt-0 first:prose-p:mt-0',
  /* prose styles */ css.css,
);
