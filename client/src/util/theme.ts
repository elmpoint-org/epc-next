import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'var(--font-default)',

  breakpoints: {
    xs: '640px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1536px',
  },

  colors: {
    emerald: [
      '#d1fae5',
      '#a7f3d0',
      '#6ee7b7',
      '#34d399',
      '#10b981',
      '#059669',
      '#047857',
      '#065f46',
      '#064e3b',
      '#022c22',
    ],
  },
  primaryColor: 'emerald',
  white: '#f1f5f9',
  black: '#020617',
});
