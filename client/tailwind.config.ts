import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

import defaults from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

import { tiptapSelectors } from './src/app/cms/_tiptap/selectors';

export const font = ['var(--font-default)', ...defaults.fontFamily.sans];

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/theme/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: font,
      },
      colors: {
        dwhite: colors.slate[100],
        dblack: colors.slate[950],
        dgreen: colors.emerald[800],
      },
    },
  },
  plugins: [typography, tiptapSelectors],
};
export default config;
