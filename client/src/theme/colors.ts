import { MantineThemeOverride } from '@mantine/core';
import { amber, emerald, red, slate } from 'tailwindcss/colors';

export const colors: MantineThemeOverride = {
  colors: {
    // generic colors
    emerald: twColors(emerald),
    slate: twColors(slate),

    // status colors
    red: twColors(red),
    amber: twColors(amber),
  },
  primaryColor: 'emerald',
  white: slate[100],
  black: slate[950],
};

function twColors(c: Record<string, string>, swap?: 'SWAP') {
  let t = Object.keys(c).sort((a, b) => parseInt(a) - parseInt(b));
  t = swap ? t.slice(0, -1) : t.slice(1);
  t = t.map((it) => c[it]);

  while (t.length < 10) t.push(t.at(-1)!);
  return t as MantineColors;
}

// prettier-ignore
type MantineColors = [string, string, string, string, string, string, string, string, string, string, ...string[]];
