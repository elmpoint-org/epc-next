import { DefaultMantineColor, MantineColorsTuple } from '@mantine/core';
import { ExtractLiterals } from '@/util/inferTypes';

import { NewColors } from './colors';

export type ExtendedMantineColors =
  | NewColors
  | ExtractLiterals<DefaultMantineColor>;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedMantineColors, MantineColorsTuple>;
  }
}
