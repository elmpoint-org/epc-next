import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

import defaults from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-default)', ...defaults.fontFamily.sans],
      },
      colors: {
        dwhite: colors.slate[100],
        dblack: colors.slate[950],
        dgreen: colors.emerald[800],
      },
    },
  },
  plugins: [typography],
};
export default config;
