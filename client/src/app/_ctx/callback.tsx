import { Children } from '@/util/propTypes';
import { useContext } from 'react';
import { createContext } from 'react';

export function createCallbackCtx<
  CbType extends (...p: any[]) => any = () => void,
>() {
  const ctx = createContext<CbType | null>(null);

  function Provider({ cb, children }: { cb: CbType } & Children) {
    return <ctx.Provider value={cb}>{children}</ctx.Provider>;
  }

  function useHook() {
    return useContext(ctx);
  }

  return { Provider, useHook };
}
