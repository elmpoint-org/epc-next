import { twMerge } from 'tailwind-merge';

export const clx = (...s: (string | null | false | undefined)[]) =>
  s.filter((it) => typeof it === 'string').join(' ');

export const clmx = twMerge;
