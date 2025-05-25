'use client';

import { useState } from 'react';
import type { Children } from '@/util/propTypes';

export default function ActivationBoundary({
  enable,
  children,
}: { enable: boolean } & Children) {
  const [show] = useState(enable);

  return (
    <>
      {show ? (
        <>{children}</>
      ) : (
        // failure message
        <>
          <div className="relative flex flex-col items-center justify-center p-6">
            <div className="text-red-600">
              <p>request failed.</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
