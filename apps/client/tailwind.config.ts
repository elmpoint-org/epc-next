import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import containers from '@tailwindcss/container-queries';

import defaults from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

import { tiptapSelectors } from './src/app/cms/_tiptap/selectors';
import { calendarSelectors } from './src/app/calendar/_util/selectors';

export const font = ['var(--font-default)', ...defaults.fontFamily.sans];

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/theme/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-default), ui-sans-serif, system-ui, sans-serif',
      },
      colors: {
        dwhite: colors.slate[100],
        dblack: colors.slate[950],
        dgreen: colors.emerald[800],
      },
    },
  },
  plugins: [typography, containers, tiptapSelectors, calendarSelectors],
} satisfies Config;
export default config;
