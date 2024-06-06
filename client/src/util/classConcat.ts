export const clx = (...s: (string | null | undefined)[]) =>
  s.filter((it) => typeof it === 'string').join(' ');
