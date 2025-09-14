import { clx } from '@/util/classConcat';

export const dayStyles = clx(
  /* weekend */ 'data-weekend:not-data-selected:text-emerald-800/80',
  /* today */ 'border-solid data-today:not-data-in-range:not-data-selected:border data-today:not-data-in-range:not-data-selected:border-slate-800/50',
  /* disabled */ 'data-disabled:rounded-none data-disabled:bg-slate-300 data-disabled:text-slate-600 data-disabled:opacity-30',
);
