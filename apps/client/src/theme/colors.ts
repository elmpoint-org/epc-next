import { MantineThemeOverride } from '@mantine/core';
import { amber, emerald, red, slate } from 'tailwindcss/colors';

export type NewColors =
  | 'black'
  | 'white'
  // ----------
  | 'emerald'
  | 'slate'
  | 'amber';

export const colors: MantineThemeOverride = {
  colors: {
    // generic colors
    emerald: twColors(emerald),
    slate: twColors(slate),

    // status colors
    red: twColors(red),
    amber: twColors(amber),

    // open-colors gray mixed with tw slate
    gray: [
      slate[50],
      slate[100],
      '#eaeff5',
      slate[200],
      slate[300],
      '#9babc0',
      '#73839a',
      slate[600],
      slate[700],
      slate[800],
    ],
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
