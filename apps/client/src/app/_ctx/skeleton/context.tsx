'use client';

import type { Children } from '@/util/propTypes';
import { createContext, useContext, useEffect, useState } from 'react';

const ctx = createContext(false);

// skeleton exports

/**
 * get whether to render skeleton or not
 * @returns whether to use skeleton or not
 */
export function useSkeleton(ready?: boolean) {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (ready) setLoad(true);
  }, [ready]);

  const c = useContext(ctx);

  if (typeof ready === 'undefined') return c;
  return !load;
}

export function SkeletonProvider({
  ready = true,
  children,
}: { ready?: boolean } & Children) {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (ready) setLoad(true);
  }, [ready]);

  return (
    <>
      <ctx.Provider value={!load}>
        {/*  */}
        {children}
      </ctx.Provider>
    </>
  );
}
