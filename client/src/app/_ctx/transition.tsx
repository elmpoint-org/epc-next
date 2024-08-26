import { Children } from '@/util/propTypes';
import {
  TransitionStartFunction,
  createContext,
  useContext,
  useTransition,
} from 'react';

export type TransitionType = [boolean | null, TransitionStartFunction | null];

const loadCtx = createContext<TransitionType>([null, null]);
export function useLoadState() {
  return useContext(loadCtx);
}

export function LoadStateProvider({
  children,
  transition: passedTransition,
}: { transition?: ReturnType<typeof useTransition> } & Children) {
  const transition = useTransition();
  return (
    <>
      <loadCtx.Provider value={passedTransition ?? transition}>
        {children}
        {/*  */}
      </loadCtx.Provider>
    </>
  );
}
