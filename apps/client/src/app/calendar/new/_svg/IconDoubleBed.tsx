import { IconProps } from '@tabler/icons-react';
import { forwardRef } from 'react';

export const IconDoubleBed = forwardRef<SVGSVGElement, IconProps>(
  ({ size, stroke, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size ?? 24}
        height={size ?? 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke ?? 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M12 4v6" />
        <path d="M2 18h20" />
      </svg>
    );
  },
);
IconDoubleBed.displayName = 'IconDoubleBed';
