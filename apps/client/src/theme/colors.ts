import { MantineThemeOverride } from '@mantine/core';
import tw from 'tailwindcss/colors';

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
    emerald: twColors(tw.emerald),
    slate: twColors(tw.slate),

    // status colors
    red: twColors(tw.red),
    amber: twColors(tw.amber),

    // open-colors gray mixed with tw slate
    gray: [
      tw.slate[50],
      tw.slate[100],
      '#eaeff5',
      tw.slate[200],
      tw.slate[300],
      '#9babc0',
      '#73839a',
      tw.slate[600],
      tw.slate[700],
      tw.slate[800],
    ],
  },
  primaryColor: 'emerald',
  white: tw.slate[100],
  black: tw.slate[950],
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
