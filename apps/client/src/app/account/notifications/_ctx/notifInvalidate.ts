import { createCallbackCtx } from '@/app/_ctx/callback';

export const { Provider: InvalidateProvider, useHook: useNotifInvalidate } =
  createCallbackCtx<() => Promise<any>>();
