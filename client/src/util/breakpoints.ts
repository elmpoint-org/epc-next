import tailwindConfig from '@/../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const { theme } = resolveConfig(tailwindConfig);

export const breakpoints = (s: keyof typeof theme.screens) =>
  parseFloat(theme.screens[s].match(/[\d.]+/)?.[0] ?? '');
