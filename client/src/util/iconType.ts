import type { Icon, IconProps } from '@tabler/icons-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type IconType = ForwardRefExoticComponent<
  Omit<IconProps, 'ref'> & RefAttributes<Icon>
>;
