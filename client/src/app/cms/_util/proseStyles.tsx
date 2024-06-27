import { clx } from '@/util/classConcat';

export const proseStyles = clx(
  'flex min-h-48 flex-col [&>*]:flex-1',
  /* prose */ 'prose prose-slate max-w-none first:prose-headings:mt-0 first:prose-p:mt-0',
  /* []() */ 'prose-a:font-bold prose-a:text-emerald-700 hover:prose-a:bg-dgreen/5',
  /* >  */ '*:prose-blockquote:not-italic before:*:prose-blockquote:content-none after:*:prose-blockquote:content-none',
  /* ` ` */ 'prose-code:-m-0 prose-code:rounded-md prose-code:bg-slate-200 prose-code:p-0 before:prose-code:content-none after:prose-code:content-none',
  /* ``` */ 'prose-pre:!bg-slate-200',
);
