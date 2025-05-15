import { twMerge } from 'tailwind-merge';

export const clx = (...s: (string | unknown)[]) =>
  s.filter((it) => typeof it === 'string').join(' ');

export const clmx = twMerge;
