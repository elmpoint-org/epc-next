import { createTheme } from '@mantine/core';

import { colors } from './colors';

export const theme = createTheme({
  fontFamily: 'var(--font-sans)',

  breakpoints: {
    xs: '640px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1536px',
  },

  ...colors,
});
