import { MantineThemeOverride } from '@mantine/core';
import { amber, emerald, red, slate } from 'tailwindcss/colors';

export const colors: MantineThemeOverride = {
  colors: {
    // generic colors
    emerald: twColors(emerald),

    // status colors
    error: twColors(red),
    warning: twColors(amber),
  },
  primaryColor: 'emerald',
  white: slate[100],
  black: slate[950],
};

function twColors(c: Record<string, string>) {
  const t = Object.keys(c)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .slice(1)
    .map((it) => c[it]);

  while (t.length < 10) t.push(t.at(-1)!);
  return t as MantineColors;
}

// prettier-ignore
type MantineColors = [string, string, string, string, string, string, string, string, string, string, ...string[]];
