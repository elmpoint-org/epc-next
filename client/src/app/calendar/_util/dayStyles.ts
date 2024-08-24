import { clx } from '@/util/classConcat';

export const dayStyles = clx(
  'border-solid data-[weekend]:[&:not([data-selected])]:text-emerald-800/80 data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border data-[today]:[&:not([data-in-range])]:[&:not([data-selected])]:border-slate-800/50',
);
