import { Kbd, KbdProps } from '@mantine/core';
import { forwardRef } from 'react';

/** dark mantine Kbd */
const DKbd = forwardRef<HTMLElement, KbdProps>((p, r) => {
  return (
    <Kbd
      ref={r}
      {...p}
      className="ml-1 border-slate-700 bg-slate-600 text-dwhite"
    >
      {p.children}
    </Kbd>
  );
});
DKbd.displayName = 'DKbd';

export default DKbd;
