import { clmx } from '@/util/classConcat';
import type React from 'react';

export default function ColorText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'b'>) {
  return (
    <>
      <b
        className={clmx(
          'bg-linear-to-br from-emerald-500 to-emerald-900 bg-clip-text text-transparent',
          className,
        )}
        {...props}
      />
    </>
  );
}
