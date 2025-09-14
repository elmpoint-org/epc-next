import { useMemo } from 'react';

export const BREAKPOINT_MAP = {
  sm: 'var(--breakpoint-sm)',
  md: 'var(--breakpoint-md)',
  lg: 'var(--breakpoint-lg)',
  xl: 'var(--breakpoint-xl)',
  '2xl': 'var(--breakpoint-2xl)',
} as const;
export type Breakpoint = keyof typeof BREAKPOINT_MAP;

export function useBreakpoints(breakpoint: Breakpoint) {
  const breakpoints = /* useMemo */(() => {
    if (typeof window === 'undefined') return null;

    // get css variable
    const variableName = BREAKPOINT_MAP[breakpoint];
    const styles = getComputedStyle(document.documentElement);

    // calculate value
    const value = styles.getPropertyValue(variableName).trim();
    // Check if value is in rem units
    if (value.endsWith('rem')) {
      const remValue = parseFloat(value.replace('rem', ''));
      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      return remValue * rootFontSize;
    }
    // Fallback: extract numeric value (assume px)
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  }/* , [breakpoint] */);

  return breakpoints();
}
