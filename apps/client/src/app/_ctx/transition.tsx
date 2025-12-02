'use client';

import { Children } from '@/util/propTypes';
import { useLoading } from '@/util/useLoading';
import { createContext, useContext } from 'react';

export type LoadingStartFunction = ReturnType<typeof useLoading<void>>[1];
export type TransitionType = readonly [
  boolean | null,
  LoadingStartFunction | null,
];

const loadCtx = createContext<TransitionType>([null, null]);
export function usePassedTransition() {
  return useContext(loadCtx);
}

export function TransitionProvider({
  children,
  transition: passedTransition,
}: { transition?: ReturnType<typeof useLoading<void>> } & Children) {
  const transition = useLoading();
  return (
    <>
      <loadCtx.Provider value={passedTransition ?? transition}>
        {children}
        {/*  */}
      </loadCtx.Provider>
    </>
  );
}
